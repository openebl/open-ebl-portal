import { Platforms, type UserRoles, Users } from "@/drizzle/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { hasPermission } from "@/server/permissions";
import { PlatformFormSchema } from "@/types/admin-platform";
import { UserFormSchema } from "@/types/user";
import { eq, type InferSelectModel, sql } from "drizzle-orm";
import { z } from "zod";

interface UserRoleWithUser extends InferSelectModel<typeof UserRoles> {
  User: InferSelectModel<typeof Users>;
}

interface PlatformWithUserRoles extends InferSelectModel<typeof Platforms> {
  UserRoles: UserRoleWithUser[];
}

// console.log(PlatformRelations, UserRoleRelations);

export const adminPlatformRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    if (!hasPermission("read:admin/platforms", ctx.session.permissions))
      throw new Error("You are not authorized to list platforms");

    return ctx.db.query.Platforms.findMany({
      orderBy: Users.id,
    });
  }),

  get: protectedProcedure.input(z.bigint()).query(({ ctx, input }) => {
    if (!hasPermission("read:admin/platforms", ctx.session.permissions))
      throw new Error("You are not authorized to get platforms");

    return ctx.db.query.Platforms.findFirst({
      where: eq(Platforms.id, BigInt(input)),
    });
  }),

  getWithUserRoles: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      if (!hasPermission("read:admin/platforms", ctx.session.permissions))
        throw new Error("You are not authorized to get platforms");

      return ctx.db.query.Platforms.findFirst({
        where: eq(Platforms.id, BigInt(input.id)),
        with: {
          UserRoles: {
            with: { User: true },
          },
        },
      }) as Promise<PlatformWithUserRoles | null>;
    }),

  create: protectedProcedure
    .input(PlatformFormSchema)
    .mutation(({ ctx, input }) => {
      if (!hasPermission("write:admin/platforms", ctx.session.permissions))
        throw new Error("You are not authorized to create platforms");

      const { name, platformId, ...businessInfo } = input;
      return ctx.db.insert(Platforms).values({
        name,
        platformId,
        businessInfo,
      });
    }),

  update: protectedProcedure
    .input(PlatformFormSchema.and(z.object({ id: z.bigint() })))
    .mutation(({ ctx, input }) => {
      if (!hasPermission("write:admin/platforms", ctx.session.permissions))
        throw new Error("You are not authorized to create platforms");

      const { id, name, platformId, ...businessInfo } = input;
      return ctx.db
        .update(Platforms)
        .set({
          name,
          platformId,
          businessInfo,
        })
        .where(eq(Platforms.id, id));
    }),

  addUser: protectedProcedure
    .input(UserFormSchema.and(z.object({ platformId: z.string() })))
    .mutation(async ({ ctx, input }) => {
      if (!hasPermission("write:admin/platforms", ctx.session.permissions))
        throw new Error("You are not authorized to update platforms");

      const result = await ctx.db.execute(sql`
        WITH platform AS (
          SELECT * FROM "Platform"
          WHERE "id" = ${BigInt(input.platformId)}
        ),
        upserted_user AS (
          INSERT INTO "User" ("email", "name", "activePlatformId")
          SELECT ${input.email}, ${input.name}, "id"
          FROM platform
          WHERE EXISTS (SELECT 1 FROM platform)
          ON CONFLICT ("email") DO UPDATE
          SET "updatedAt" = now()
          RETURNING *
        ),
        deleted_roles AS (
          DELETE FROM "UserRole"
          WHERE "userId" = (SELECT "id" FROM upserted_user)
            AND "platformId" = (SELECT "id" FROM platform)
            AND  EXISTS (SELECT 1 FROM platform)
          RETURNING 1
        ),
        new_role AS (
          INSERT INTO "UserRole" ("userId", "platformId", "role")
          SELECT
            (SELECT "id" FROM upserted_user),
            (SELECT "id" FROM platform),
            ${input.role}
          WHERE EXISTS (SELECT 1 FROM platform)
            AND (EXISTS (SELECT 1 FROM deleted_roles) OR 1 = 1)
          RETURNING *
        )
        SELECT
          CASE
            WHEN NOT EXISTS (SELECT 1 FROM platform) THEN 'platform_not_found'
            WHEN NOT EXISTS (SELECT 1 FROM new_role) THEN 'user_creation_failed'
            ELSE 'success'
          END AS result,
          upserted_user.*
        FROM upserted_user`);

      if (result.length === 0) {
        throw new Error("User creation failed");
      }
      if (result[0]!.result !== "success")
        throw new Error(String(result[0]!.result));
    }),

  removeUser: protectedProcedure
    .input(z.object({ userId: z.bigint(), platformId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!hasPermission("write:admin/platforms", ctx.session.permissions))
        throw new Error("You are not authorized to update platforms");

      const userId = input.userId;
      const platformId = BigInt(input.platformId);
      if (
        input.userId === ctx.session.user.id &&
        platformId === ctx.session.platform.id
      ) {
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
        WITH
        deleted_roles AS (
          DELETE FROM "UserRole"
          WHERE "userId" = ${userId} AND "platformId" = ${platformId}
          RETURNING 1
        ),
        remaining_roles AS (
          SELECT "platformId"
          FROM "UserRole"
          WHERE "userId" = ${userId} AND "platformId" <> ${platformId}
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
