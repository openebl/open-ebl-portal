import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  updateInfo: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      ctx.session.user.name = input.name;
      return ctx.db.user.update({ where: { id: ctx.session.user.id }, data: { name: input.name } });
    }),
});
