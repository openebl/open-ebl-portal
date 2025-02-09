import { z } from "zod";

import { UserAgreements, UserRoles, Users } from "@/drizzle/schema";
import { sendUserInvitation } from "@/emails/send-user-invitation";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { hasPermission } from "@/server/permissions";
import { UserFormSchema, UserRoleSchema } from "@/types/user";
import { and, count, eq, max, sql } from "drizzle-orm";
import { getLogger } from "@/lib/logger";

interface PendingAgreement {
  name: string;
  service: string;
  version: number;
  url: string;
}

export const userRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        id: Users.id,
        name: Users.name,
        email: Users.email,
        emailVerified: Users.emailVerified,
        roles: sql<
          string[]
        >`array_agg("UserRole".role) FILTER (WHERE "UserRole".role IS NOT NULL)`,
      })
      .from(Users)
      .innerJoin(
        UserRoles,
        and(
          eq(Users.id, UserRoles.userId),
          eq(UserRoles.platformId, ctx.session.platform.id),
        ),
      )
      .groupBy(Users.id)
      .execute();

    return result;
  }),

  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    if (!hasPermission("read:settings/users", ctx.session.permissions)) {
      throw new Error("You are not authorized to get user");
    }

    const [user] = await ctx.db
      .select({
        id: Users.id,
        name: Users.name,
        email: Users.email,
        emailVerified: Users.emailVerified,
        roles: sql<
          string[]
        >`array_agg("UserRole".role) FILTER (WHERE "UserRole".role IS NOT NULL)`,
      })
      .from(Users)
      .leftJoin(
        UserRoles,
        and(eq(Users.id, UserRoles.userId), eq(Users.id, BigInt(input))),
      )
      .groupBy(Users.id);

    return user;
  }),

  pendingAgreements: protectedProcedure.query(async ({ ctx }) => {
    const [agreements, accepted] = await Promise.all([
      ctx.agreementManifest.get(),
      ctx.db
        .select({
          service: UserAgreements.service,
          name: UserAgreements.name,
          version: max(UserAgreements.version),
        })
        .from(UserAgreements)
        .where(eq(UserAgreements.userId, ctx.session.user.id))
        .groupBy(UserAgreements.service, UserAgreements.name),
    ]);

    getLogger().info(`all agreements: ${JSON.stringify(agreements)}`);
    getLogger().info(`accepted agreements: ${JSON.stringify(accepted)}`);

    return agreements.filter((agreement) => {
      const wasAccepted = accepted.find(
        (a) => a.service === agreement.service && a.name === agreement.name,
      );
      return !wasAccepted || (wasAccepted.version ?? 0) < agreement.version;
    }) as PendingAgreement[];
  }),

  acceptAgreements: protectedProcedure
    .input(
      z.array(
        z.object({
          service: z.string(),
          name: z.string(),
          version: z.number(),
          acceptedAt: z.number(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(UserAgreements)
        .values(
          input.map((a) => ({
            userId: ctx.session.user.id,
            platformId: ctx.session.platform.id,
            requesterId: ctx.session.requesterId,
            service: a.service,
            name: a.name,
            version: a.version,
            acceptedAt: new Date(a.acceptedAt),
          })),
        )
        .onConflictDoNothing({
          target: [
            UserAgreements.userId,
            UserAgreements.service,
            UserAgreements.name,
            UserAgreements.version,
          ],
        });
    }),

  invite: protectedProcedure
    .input(UserFormSchema)
    .mutation(async ({ ctx, input }) => {
      if (!hasPermission("write:settings/users", ctx.session.permissions)) {
        throw new Error("You are not authorized to invite users");
      }

      const newUser = await ctx.db.transaction(async (tx) => {
        // Upsert user
        const [user] = await tx
          .insert(Users)
          .values({
            name: input.name,
            email: input.email,
            activePlatformId: ctx.session.platform.id,
          })
          .onConflictDoUpdate({
            target: Users.email,
            set: { updatedAt: sql`now()` },
          })
          .returning();

        if (!user) {
          throw new Error("Failed to create user");
        }

        // Insert new role
        await tx
          .insert(UserRoles)
          .values({
            userId: user.id,
            role: input.role,
            platformId: ctx.session.platform.id,
          })
          .onConflictDoNothing({
            target: [UserRoles.userId, UserRoles.platformId, UserRoles.role],
          });

        return user;
      });

      if (!newUser.emailVerified) {
        sendUserInvitation({
          service: ctx.emailService,
          receiver: newUser,
          sender: ctx.session.user,
        }).catch((err) =>
          getLogger().error(`Failed to send user invitation: ${err}`),
        );
      }

      return true;
    }),

  sendInvitation: protectedProcedure
    .input(z.object({ id: z.bigint() }))
    .mutation(async ({ ctx, input }) => {
      if (!hasPermission("write:settings/users", ctx.session.permissions)) {
        throw new Error("You are not authorized to invite users");
      }
      const user = await ctx.db
        .select()
        .from(Users)
        .where(eq(Users.id, input.id))
        .execute();

      if (user.length <= 0) {
        throw new Error("User not found");
      }

      sendUserInvitation({
        service: ctx.emailService,
        receiver: user[0]!,
        sender: ctx.session.user,
      }).catch((err) =>
        getLogger().error(`Failed to send user invitation: ${err}`),
      );
    }),

  updateInfo: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(Users)
        .set({ name: input.name })
        .where(eq(Users.id, ctx.session.user.id));
    }),

  updateRole: protectedProcedure
    .input(z.object({ id: z.string(), role: UserRoleSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!hasPermission("write:settings/users", ctx.session.permissions)) {
        throw new Error("You are not authorized to update user role");
      }

      const userId = BigInt(input.id);
      if (userId === ctx.session.user.id) {
        throw new Error("You cannot update your own role");
      }

      const [{ total }] = (await ctx.db
        .select({ total: count() })
        .from(Users)
        .where(
          sql`id = ${userId} AND activePlatformId = ${ctx.session.platform.id}`,
        )
        .execute()) as [{ total: number }];

      if (!total) {
        throw new Error("You can update role of users from your platform");
      }

      await ctx.db.execute(sql`
        WITH deleted_roles AS (
          DELETE FROM "UserRoles"
          WHERE "userId" = ${userId} AND "platformId" = ${ctx.session.platform.id}
        )
        INSERT INTO "UserRoles" ("userId", "role", "platformId")
        VALUES (${userId}, ${input.role}, ${ctx.session.platform.id})
      `);
    }),

  // update current user's active platform
  updateActivePlatform: protectedProcedure
    .input(z.object({ platformId: z.bigint() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(Users)
        .set({ activePlatformId: input.platformId })
        .where(eq(Users.id, ctx.session.user.id))
        .execute();
    }),

  // remove specific user from current platform
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!hasPermission("write:settings/users", ctx.session.permissions)) {
        throw new Error("You are not authorized to delete user");
      }

      const userId = BigInt(input);
      if (userId === ctx.session.user.id) {
        throw new Error("You cannot delete yourself");
      }

      // This query performs the following operations in a single transaction:
      // 1. Deletes specified user roles
      // 2. Checks for remaining roles for the user
      // 3. Either deletes the user (if no roles remain) or updates their active platform
      // The query uses Common Table Expressions (CTEs) to break down the operation into logical steps:
      // - deleted_roles: Deletes specified user roles
      // - remaining_roles: Checks for any roles the user still has, excluding the one being deleted
      // - user_delete: Attempts to delete the user if no roles remain
      // - user_update: Attempts to update the user's active platform if roles remain
      await ctx.db.execute(sql`
        WITH deleted_roles AS (
          DELETE FROM "UserRole"
          WHERE "userId" = ${userId} AND "platformId" = ${ctx.session.platform.id}
          RETURNING 1
        ),
        remaining_roles AS (
          SELECT "platformId" FROM "UserRole"
          WHERE "userId" = ${userId} AND "platformId" <> ${ctx.session.platform.id}
          FOR UPDATE
        ),
        user_delete AS (
          DELETE FROM "User"
          WHERE "id" = ${userId} AND NOT EXISTS (SELECT 1 FROM remaining_roles)
          RETURNING 1
        ),
        user_update AS (
          UPDATE "User"
          SET "activePlatformId" = (SELECT "platformId" FROM remaining_roles LIMIT 1)
          WHERE "id" = ${userId} AND EXISTS (SELECT 1 FROM remaining_roles)
          RETURNING 1
        )
        SELECT * FROM user_update, user_delete
      `);

      return true;
    }),
});
