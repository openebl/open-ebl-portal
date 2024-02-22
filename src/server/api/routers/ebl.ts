import { Effect } from "effect";
import { pick } from "remeda";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getDocImagesByDocFileId } from "@/server/fx/doc-image";
import {
  DatabaseService,
  liveDatabaseService,
} from "@/server/services/database-service";
import { StorageService } from "@/server/services/storage-service";
import { EBlRowSchemaList, EBlDraftSchema, EBlSchema, EBlRowSchema } from "@/types/ebl";
import { EBlStatus, type EBl } from "@prisma/client";

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
      const ebls = await ctx.db.$queryRawUnsafe<EBl[]>(
        `SELECT * FROM "EBl" WHERE "status" IN (${statusCond}) AND "id" in (
          SELECT "eBlId" FROM "EBlJourney" WHERE "targetPlatformId" = $${input.status.length + 1}
         )
         OR "status" = CAST('DRAFT'::text AS "public"."EBlStatus")
         ORDER BY "updatedAt" DESC`,
        ...input.status,
        ctx.session.platformId,
      );

      const result = ebls.map((ebl) => ({
        ...ebl,
        ownerPlatform: ebl.ownerPlatformId?.toString(),
        nextPlatform: ebl.nextPlatformId?.toString(),
        issuer: ebl.issuerId?.toString(),
        shipper: ebl.shipperId?.toString(),
        consignee: ebl.consigneeId?.toString(),
        releaseAgent: ebl.releaseAgentId?.toString(),
      }));

      return EBlRowSchemaList.parseAsync(result);
    }),

  getWithImages: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const runnable = DatabaseService.pipe(
        Effect.flatMap((db) => db.transaction()),
        Effect.flatMap((tx) =>
          Effect.promise(() => {
            return tx.eBl.findUnique({ where: { id: input },include: {
              docFile: true,
              issuerPlatform: true,
              shipperPlatform: true,
              consigneePlatform: true,
              releaseAgentPlatform: true,
            }, });
          }),
        ),

        Effect.flatMap((ebl) =>
          ebl
            ? Effect.succeed({
                ...ebl,
                docFilename: ebl?.docFile?.filename,
                ownerPlatform: ebl.ownerPlatformId?.toString(),
                nextPlatform: ebl.nextPlatformId?.toString(),
                issuer: ebl.issuerId?.toString(),
                shipper: ebl.shipperId?.toString(),
                consignee: ebl.consigneeId?.toString(),
                releaseAgent: ebl.releaseAgentId?.toString(),
                issuerName: ebl.issuerPlatform?.name,
                shipperName: ebl.shipperPlatform?.name,
                consigneeName: ebl.consigneePlatform?.name,
                releaseAgentName: ebl.releaseAgentPlatform?.name,
                allowActions: [],
              })
            : Effect.fail(new Error("not found")),
        ),

        Effect.flatMap((ebl) => {
          return getDocImagesByDocFileId(ebl.docFileId!).pipe(
            Effect.map((images) => ({ ebl, images })),
          );
        }),

        Effect.provideService(DatabaseService, liveDatabaseService(ctx.db)),
        Effect.provideService(StorageService, ctx.storageService),
      );

      const res = await Effect.runPromise(Effect.scoped(runnable));
      return {
        ebl: EBlRowSchema.parse(res.ebl),
        images: res.images,
      }
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
      const res = await ctx.db.eBl.update({
        where: { id: input.id },
        data: {
          ...pick(input, ["blNumber", "blType", "pol", "pod", "eta", "notes"]),
          status: "DRAFT",
          issuerPlatform: { connect: { id: ctx.session.platformId } },
          shipperPlatform: input.shipper
            ? { connect: { id: BigInt(input.shipper) } }
            : undefined,
          consigneePlatform: input.consignee
            ? { connect: { id: BigInt(input.consignee) } }
            : undefined,
          releaseAgentPlatform: input.releaseAgent
            ? { connect: { id: BigInt(input.releaseAgent) } }
            : undefined,
        },
      });
      return res.id;
    }),

  issue: protectedProcedure
    .input(EBlSchema.omit({ status: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async () => {
        const ebl = await ctx.db.eBl.update({
          where: { id: input.id },
          data: {
            ...pick(input, ["blNumber", "blType", "pol", "pod", "eta", "notes"]),
            issuerPlatform: { connect: { id: ctx.session.platformId } },
            shipperPlatform: input.shipper
              ? { connect: { id: BigInt(input.shipper) } }
              : undefined,
            consigneePlatform: input.consignee
              ? { connect: { id: BigInt(input.consignee) } }
              : undefined,
            releaseAgentPlatform: input.releaseAgent
              ? { connect: { id: BigInt(input.releaseAgent) } }
              : undefined,
              ownerPlatformId: BigInt(input.shipper),
              nextPlatformId: BigInt(input.consignee),
            status: "PROCESSING",
          },
        });
        await ctx.db.eBlJourney.create({
          data: {
            eBlId: ebl.id,
            action: "DRAFT",
            lastStatus: "DRAFT",
            targetPlatformId: ctx.session.platformId,
            sourcePlatformId: ctx.session.platformId,
            userId: ctx.session.user.id,
          },
        });
        await ctx.db.eBlJourney.create({
          data: {
            eBlId: ebl.id,
            action: "ISSUE",
            lastStatus: "PROCESSING",
            targetPlatformId: BigInt(input.shipper),
            sourcePlatformId: ctx.session.platformId,
            userId: ctx.session.user.id,
          },
        });
        return ebl.id;
      });
    }),

  transfer: protectedProcedure
    .input(EBlSchema.omit({ status: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async () => {
        const ebl = await ctx.db.eBl.update({
          where: { id: input.id },
          data: {
            ...pick(input, ["blNumber", "blType", "pol", "pod", "eta", "notes"]),
            issuerPlatform: { connect: { id: ctx.session.platformId } },
            shipperPlatform: input.shipper
              ? { connect: { id: BigInt(input.shipper) } }
              : undefined,
            consigneePlatform: input.consignee
              ? { connect: { id: BigInt(input.consignee) } }
              : undefined,
            releaseAgentPlatform: input.releaseAgent
              ? { connect: { id: BigInt(input.releaseAgent) } }
              : undefined,
              ownerPlatformId: BigInt(input.shipper),
              nextPlatformId: BigInt(input.consignee),
            status: "PROCESSING",
          },
        });
        await ctx.db.eBlJourney.create({
          data: {
            eBlId: ebl.id,
            action: "DRAFT",
            lastStatus: "DRAFT",
            targetPlatformId: ctx.session.platformId,
            sourcePlatformId: ctx.session.platformId,
            userId: ctx.session.user.id,
          },
        });
        await ctx.db.eBlJourney.create({
          data: {
            eBlId: ebl.id,
            action: "ISSUE",
            lastStatus: "PROCESSING",
            targetPlatformId: BigInt(input.shipper),
            sourcePlatformId: ctx.session.platformId,
            userId: ctx.session.user.id,
          },
        });
        return ebl.id;
      });
    }),
  });
