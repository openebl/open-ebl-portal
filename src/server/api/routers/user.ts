import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { UserFormSchema, UserRoleSchema } from "@/types/user";
import { Session } from "inspector";
import { db } from "@/server/db";

export const userRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      include: { userRoles: true },
      where: {
        userRoles: {
          some: {
            platformId: ctx.session.platform.id,
          },
        },
      },
    });
  }),

  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    if (!ctx.session.roles.includes("admin")) {
      throw new Error("You are not authorized to get user");
    }

    return ctx.db.user.findUnique({
      where: {
        id: BigInt(input),
      },
      include: { userRoles: true },
    });
  }),

  invite: protectedProcedure
    .input(UserFormSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.roles.includes("admin")) {
        throw new Error("You are not authorized to invite users");
      }

      const count = await ctx.db.user.count({ where: { email: input.email } });
      if (count > 0) {
        throw new Error("User with this email already exists");
      }

      // TODO: send invite email
      return ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          activePlatform: {
            connect: {
              id: ctx.session.platform.id,
            },
          },
          userRoles: {
            create: {
              role: input.role,
              platformId: ctx.session.platform.id,
            },
          },
        },
      });
    }),

  updateInfo: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name },
      });
    }),

  updateRole: protectedProcedure
    .input(z.object({ id: z.string(), role: UserRoleSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.roles.includes("admin")) {
        throw new Error("You are not authorized to update user role");
      }

      const userId = BigInt(input.id);
      if (userId === ctx.session.user.id) {
        throw new Error("You cannot update your own role");
      }

      if (
        (await ctx.db.user.count({
          where: { id: userId, activePlatformId: ctx.session.platform.id },
        })) === 0
      ) {
        throw new Error("You can update role of users from your platform");
      }

      return db.$transaction(async (db) => {
        await db.userRole.deleteMany({
          where: { userId, platformId: ctx.session.platform.id },
        });

        await db.userRole.create({
          data: {
            userId,
            platformId: ctx.session.platform.id,
            role: input.role,
          },
        });
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.roles.includes("admin")) {
        throw new Error("You are not authorized to delete user");
      }

      const userId = BigInt(input);
      if (userId === ctx.session.user.id) {
        throw new Error("You cannot delete yourself");
      }

      if (
        (await ctx.db.user.count({
          where: { id: userId, activePlatformId: ctx.session.platform.id },
        })) === 0
      ) {
        throw new Error("You can delete only users from your platform");
      }

      return ctx.db.user.delete({
        where: {
          id: userId,
        },
      });
    }),
});
