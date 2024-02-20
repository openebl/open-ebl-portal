import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { type DocImage } from "@prisma/client";
import { Effect, pipe } from "effect";
import { groupBy, mapValues, sortBy } from "remeda";
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
      const runnable = pipe(
        Effect.promise(() => {
          return ctx.db.docImage.findFirst({
            where: { ...input },
          });
        }),

        // Effect.filterOrFail(
        //   (image) => !!(image?.storagekey),
        //   () => {
        //     return invalidQueryError(new Error("not found"))
        //   },
        // ),

        Effect.flatMap((image) =>
          ctx.storageService.getPresignedUrl({ key: image!.storagekey! }),
        ),

        // Effect.catchAll((error) =>
        //   Effect.fail(internalServerError(new Error(`${error}`))),
        // ),

        // Effect.provideService(DatabaseService, liveDatabaseService(db)),
      );

      return await Effect.runPromise(runnable);
    }),

  getUrls: protectedProcedure
    .input(
      z.object({
        docFileId: z.bigint(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const runnable = pipe(
        Effect.promise(() => {
          return ctx.db.docImage.findMany({
            where: { ...input },
            orderBy: {page: 'asc'}
          });
        }),

        // Effect.filterOrFail(
        //   (image) => !!(image?.storagekey),
        //   () => {
        //     return invalidQueryError(new Error("not found"))
        //   },
        // ),

        Effect.flatMap((images) => {
          Object.entries(groupBy(images, (n) => n.page)).map( ([page, values]) => {
            return {
              page
            }
          } )
        }),


        // Effect.catchAll((error) =>
        //   Effect.fail(internalServerError(new Error(`${error}`))),
        // ),

        // Effect.provideService(DatabaseService, liveDatabaseService(db)),
      );

      return await Effect.runPromise(runnable);
    }),
});

const groupImages = (images: DocImage[]) => {
  const result = {} as Record<number, {page: number, imageKey?:string|null, thumbnailKey?:string|null}>
  images.forEach((image) => {
    const key = (image.thumbnail ? {imageKey: image.storagekey}: {thumbnailKey: image.storagekey})
    if (!result[image.page]) {
      result[image.page] = {page:image.page, ...key}
    } else {
      result[image.page] = { ...result[image.page]!, ...key }
    }
  })
  const values = mapValues(result.values());
  return sortBy(values, (n) => n.page)
}