import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getDocImagesByDocFileId } from "@/server/fx/doc-image";
import {
  DatabaseService,
  liveDatabaseService,
} from "@/server/services/database-service";
import { StorageService } from "@/server/services/storage-service";
import {
  EBlDraftListSchema,
  EBlDraftSchema,
  eBlIdGenerator,
} from "@/types/ebl";
import { EBlStatus, type EBl } from "@prisma/client";
import { Effect } from "effect";
import { z } from "zod";

export const eBlRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        status: z
          .array(z.nativeEnum(EBlStatus))
          .optional()
          .default(["DRAFT", "PROCESSING", "COMPLETED", "PRINTED"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const statusCond = input.status
        .map((_n, i) => `CAST($${i + 1}::text AS "public"."EBlStatus")`)
        .join(", ");
      const result = await ctx.db.$queryRawUnsafe<EBl[]>(
        `SELECT * FROM "EBl" WHERE "status" IN (${statusCond}) AND "id" in (
          SELECT "eBlId" FROM "EBlJourney" WHERE "targetPlatformId" = $${input.status.length + 1}
         )
         OR "status" = CAST('DRAFT'::text AS "public"."EBlStatus")
         ORDER BY "updatedAt" DESC`,
        ...input.status,
        ctx.session.platformId,
      );

      return EBlDraftListSchema.parseAsync(result)
    }),

  getWithImages: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const runnable = DatabaseService.pipe(
        Effect.flatMap((db) => db.transaction()),
        Effect.flatMap((tx) =>
          Effect.promise(() => {
            return tx.eBl.findUnique({ where: { id: input } });
          }),
        ),

        Effect.flatMap((ebl: EBl | null) =>
          ebl ? Effect.succeed(ebl) : Effect.fail(new Error("not found")),
        ),

        Effect.flatMap((ebl) => {
          return getDocImagesByDocFileId(ebl.docFileId!).pipe(
            Effect.map((images) => ({ ebl, images })),
          );
        }),

        Effect.provideService(DatabaseService, liveDatabaseService(ctx.db)),
        Effect.provideService(StorageService, ctx.storageService),
      );

      return Effect.runPromise(Effect.scoped(runnable));
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
            status: "DRAFT",
          },
        });
        return res.id;
      }

      const res = await ctx.db.eBl.update({
        where: { id: input.id },
        data: {
          ...input,
          status: "DRAFT",
        }
      });
      return res.id;
    }),
});
