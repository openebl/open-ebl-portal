import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const docAiTaskRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.bigint().optional(), docFileId: z.bigint().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.id && !input.docFileId) return undefined

      const condition = input.id ? { id: input.id } : { docFileId: input.docFileId };
      const tasks = await ctx.db.docAiTask.findMany({ where: condition, take: 1});
      return tasks[0] ?? null;
    }),

  getStatus: protectedProcedure
    .input(z.object({ id: z.bigint().optional(), docFileId: z.bigint().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.id && !input.docFileId) return undefined

      const condition = input.id ? { id: input.id } : { docFileId: input.docFileId };
      const tasks = await ctx.db.docAiTask.findMany({ where: condition, take: 1});
      return tasks[0]?.status ?? null;
    }),
});

