import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const docExtractionRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ uuid: z.string() }))
    .query(async ({ ctx, input }) => {
      const extraction = await ctx.docExtraction.getExtraction(input.uuid);
      return extraction;
    }),
});
