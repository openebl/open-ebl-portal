import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getDocImagesByDocFileId } from "@/server/fx/doc-image";
import {
  DatabaseService,
  liveDatabaseService,
} from "@/server/services/database-service";
import { StorageService } from "@/server/services/storage-service";
import { Effect, pipe } from "effect";
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
        getDocImagesByDocFileId(input.docFileId),
        Effect.provideService(DatabaseService, liveDatabaseService(ctx.db)),
        Effect.provideService(StorageService, ctx.storageService),
      );

      return Effect.runPromise(Effect.scoped(runnable));
    }),
});
