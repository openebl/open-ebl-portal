import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

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

  updateInfo: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      ctx.session.user.name = input.name;
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name },
      });
    }),
});
