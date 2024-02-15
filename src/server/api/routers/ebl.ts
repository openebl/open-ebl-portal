import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  EBlDraftListSchema,
  EBlDraftSchema,
  eBlIdGenerator,
} from "@/types/ebl";
import { z } from "zod";

export const eBlRouter = createTRPCRouter({
  all: protectedProcedure
    // .input(z.object({ text: z.string() }))
    .query(async ({ ctx }) => {
      const ebls = await ctx.db.eBl.findMany({
        orderBy: { updatedAt: "desc" },
      });

      return EBlDraftListSchema.parseAsync(ebls).catch((err) => {
        throw new Error(`Invalid eBl: ${err}`);
      });
    }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const ebl = await ctx.db.eBl.findUnique({ where: { id: input } });
    if (!ebl) {
      return null;
    }
    return EBlDraftSchema.parseAsync(ebl).catch((err) => {
      throw new Error(`Invalid eBl: ${err}`);
    });
  }),

  findByDocFileId: protectedProcedure
    .input(z.bigint())
    .query(async ({ ctx, input }) => {
      const list = await ctx.db.eBl.findMany({
        where: { docFileId: input },
        take: 1,
      });
      return list[0]?.id ?? null;
    }),

  saveDraft: protectedProcedure
    .input(EBlDraftSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.id === "new") {
        const res = await ctx.db.eBl.create({
          data: {
            ...input,
            id: eBlIdGenerator(),
          },
        });
        return res.id;
      }

      const res = await ctx.db.eBl.update({
        where: { id: input.id },
        data: input,
      });
      return res.id;
    }),
});
