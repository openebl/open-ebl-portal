import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  DatabaseService,
  liveDatabaseService,
} from "@/server/services/database-service";
import { type DocImage } from "@prisma/client";
import { Effect, Order, pipe } from "effect";
import { struct } from "effect/Order";
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
      const runnable = DatabaseService.pipe(
        Effect.flatMap((db) => db.transaction()),
        Effect.flatMap((tx) =>
          Effect.promise(() =>
            tx.docImage.findMany({
              where: { ...input },
              orderBy: { page: "asc" },
            }),
          ),
        ),
        // Effect.filterOrFail(
        //   (image) => !!(image?.storagekey),
        //   () => {
        //     return invalidQueryError(new Error("not found"))
        //   },
        // ),

        Effect.map(groupImages),

        Effect.flatMap((images) =>
          Effect.forEach(images, (image) =>
            Effect.all({
              page: Effect.succeed(image.page),
              imageUrl: ctx.storageService.getPresignedUrl({
                key: image.imageKey!,
              }),
              thumbnailUrl: ctx.storageService.getPresignedUrl({
                key: image.thumbnailKey!,
              }),
            }),
          ),
        ),

        // Effect.catchAll((error) =>
        //   Effect.fail(internalServerError(new Error(`${error}`))),
        // ),

        Effect.provideService(DatabaseService, liveDatabaseService(ctx.db)),
      );

      return Effect.runPromise(Effect.scoped(runnable));
    }),
});

const groupImages = (images: DocImage[]) => {
  const result = {} as Record<
    number,
    { page: number; imageKey?: string | null; thumbnailKey?: string | null }
  >;
  images.forEach((image) => {
    const key = image.thumbnail
      ? { imageKey: image.storagekey }
      : { thumbnailKey: image.storagekey };
    if (!result[image.page]) {
      result[image.page] = { page: image.page, ...key };
    } else {
      result[image.page] = { ...result[image.page]!, ...key };
    }
  });
  return sortBy(Object.values(result), (n) => n.page);
};
