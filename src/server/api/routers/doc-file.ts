import { DocFiles } from "@/drizzle/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const docFileRouter = createTRPCRouter({
  findByUuid: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const docFile = await ctx.db.query.DocFiles.findFirst({
        where: eq(DocFiles.uuid, input),
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
