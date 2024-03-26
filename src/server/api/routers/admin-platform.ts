import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { hasPermission } from "@/server/permissions";
import { PlatformFormSchema } from "@/types/admin-platform";
import { UserFormSchema } from "@/types/user";
import { z } from "zod";

export const adminPlatformRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    if (!hasPermission("read:admin/platforms", ctx.session.permissions))
      throw new Error("You are not authorized to list platforms");

    return ctx.db.platform.findMany({
      orderBy: { id: "asc" },
    });
  }),

  get: protectedProcedure.input(z.bigint()).query(({ ctx, input }) => {
    if (!hasPermission("read:admin/platforms", ctx.session.permissions))
      throw new Error("You are not authorized to get platforms");

    return ctx.db.platform.findUnique({ where: { id: BigInt(input) } });
  }),

  getWithUserRoles: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      if (!hasPermission("read:admin/platforms", ctx.session.permissions))
        throw new Error("You are not authorized to get platforms");

      return ctx.db.platform.findUnique({
        where: { id: BigInt(input.id) },
        include: {
          userRoles: {
            include: { user: true },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(PlatformFormSchema)
    .mutation(({ ctx, input }) => {
      if (!hasPermission("write:admin/platforms", ctx.session.permissions))
        throw new Error("You are not authorized to create platforms");

      return ctx.db.platform.create({ data: input });
    }),

  update: protectedProcedure
    .input(PlatformFormSchema.and(z.object({ id: z.bigint() })))
    .mutation(({ ctx, input }) => {
      if (!hasPermission("write:admin/platforms", ctx.session.permissions))
        throw new Error("You are not authorized to create platforms");

      const { id, name, platformId, ...businessInfo } = input;
      return ctx.db.platform.update({
        where: { id: BigInt(id) },
        data: { name, platformId, businessInfo },
      });
    }),

  addUser: protectedProcedure
    .input(UserFormSchema.and(z.object({ platformId: z.string() })))
    .mutation(async ({ ctx, input }) => {
      if (!hasPermission("write:admin/platforms", ctx.session.permissions))
        throw new Error("You are not authorized to update platforms");

      return ctx.db.$transaction(async (tx) => {
        const platform = await tx.platform.findUnique({
          where: { id: BigInt(input.platformId) },
        });
        if (!platform) throw new Error("Platform not found");

        const user = await tx.user.upsert({
          where: { email: input.email },
          update: {
            name: input.name,
          },
          create: {
            email: input.email,
            name: input.name,
            activePlatform: {
              connect: {
                id: platform.id,
              },
            },
          },
        });

        await tx.userRole.deleteMany({
          where: { userId: user.id, platformId: platform.id },
        });

        return tx.userRole.create({
          data: {
            userId: user.id,
            platformId: platform.id,
            role: input.role,
          },
        });
      });
    }),

  removeUser: protectedProcedure
    .input(z.object({ userId: z.bigint(), platformId: z.string() }))
    .mutation(({ ctx, input }) => {
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

      return ctx.db.$transaction(async (tx) => {
        await tx.userRole.deleteMany({
          where: { userId, platformId },
        });

        const userRoles = await tx.userRole.findMany({ where: { userId } });
        if (userRoles.length === 0) {
          await tx.user.delete({ where: { id: userId } });
        } else {
          await tx.user.update({
            where: { id: userId },
            data: {
              activePlatform: {
                connect: {
                  id: userRoles[0]!.platformId,
                },
              },
            },
          });
        }

        return true;
      });
    }),
});
