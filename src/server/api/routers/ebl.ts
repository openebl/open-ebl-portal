import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { EBlDraftFormSchema, eBlIdGenerator } from "@/types/ebl";
import { isNil, pickBy } from "remeda";
import { z } from "zod";

export const eBlRouter = createTRPCRouter({
  all: protectedProcedure
    // .input(z.object({ text: z.string() }))
    .query(async ({ ctx }) => {
      const ebls = await ctx.db.eBl.findMany({
        orderBy: { updatedAt: "desc" },
      });

      return ebls;
    }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const ebl = await ctx.db.eBl.findUnique({ where: { id: input } });
    console.log(ebl)
    const eBlWithoutNull = pickBy(ebl, (v) => !isNil(v));
    return EBlDraftFormSchema.parseAsync(eBlWithoutNull).catch((err) => {
      console.log(err);
      throw new Error("Invalid eBl");
    })
  }),

  saveDraft: protectedProcedure
    .input(EBlDraftFormSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input);
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
