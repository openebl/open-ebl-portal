import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const docFileRouter = createTRPCRouter({
  findByUuid: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const docFile = await ctx.db.docFile.findUnique({
        where: { uuid: input },
      });
      if (!docFile) return null;

      return {
        ...docFile,
        contentUrl: docFile.storagekey
          ? await ctx.storageService.getPresignedUrl({
              key: docFile.storagekey,
            })
          : null,
      };
    }),
});
