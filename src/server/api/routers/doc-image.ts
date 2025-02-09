import { DocImages } from "@/drizzle/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getDocImagesByDocFileId } from "@/server/fx/doc-image";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const docImageRouter = createTRPCRouter({
  getUrl: protectedProcedure
    .input(
      z.object({
        docFileId: z.bigint(),
        page: z.number(),
        thumbnail: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { docFileId, page, thumbnail } = input;
      const image = await ctx.db.query.DocImages.findFirst({
        where: and(
          eq(DocImages.docFileId, docFileId),
          eq(DocImages.page, page),
          thumbnail ? eq(DocImages.thumbnail, true) : undefined,
        ),
      });
      if (!image?.storagekey) return null;

      return ctx.storageService.getPresignedUrl({ key: image.storagekey });
    }),

  getUrls: protectedProcedure
    .input(
      z.object({
        docFileId: z.bigint(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getDocImagesByDocFileId(
        ctx.db,
        ctx.storageService,
        input.docFileId,
      );
    }),
});
