import { Effect } from "effect";
import { find, isTruthy, pick, uniq } from "remeda";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getDocImagesByDocFileId } from "@/server/fx/doc-image";
import { eBLAllowActions, eBlQueryCondition } from "@/server/fx/ebl";
import {
  DatabaseService,
  liveDatabaseService,
} from "@/server/services/database-service";
import { StorageService } from "@/server/services/storage-service";
import {
  EBlDraftSchema,
  EBlRowSchema,
  EBlRowSchemaList,
  EBlSchema,
} from "@/types/ebl";

export const eBlRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        offset: z.number().optional().default(0),
        limit: z.number().optional().default(10),
        filter: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const condition = eBlQueryCondition(input.filter, ctx.session.platformId);

      const [ebls, count, actionRequired, upcoming, sent, archive] = await Promise.all([
        ctx.db.eBl.findMany({
          where: condition,
          orderBy: { updatedAt: "desc" },
          skip: input.offset,
          take: input.limit,
        }),
        ctx.db.eBl.count({ where: condition }),
        ctx.db.eBl.count({
          where: eBlQueryCondition("actionRequired", ctx.session.platformId),
        }),
        ctx.db.eBl.count({
          where: eBlQueryCondition("upcoming", ctx.session.platformId),
        }),
        ctx.db.eBl.count({
          where: eBlQueryCondition("sent", ctx.session.platformId),
        }),
        ctx.db.eBl.count({
          where: eBlQueryCondition("archive", ctx.session.platformId),
        }),
      ]);

      const ownerIds = ebls.map((ebl) => [ebl.issuerId, ebl.shipperId, ebl.consigneeId, ebl.releaseAgentId]).flat().filter(isTruthy);
      const platforms = await ctx.db.platform.findMany({
        where: { id: { in: uniq(ownerIds) } },
        select: { id: true, name: true },
      });
      const platformNames = new Map<bigint, string>(platforms.map((p) => [p.id, p.name]));
      const result = ebls.map((ebl) => ({
        ...ebl,
        ownerPlatform: ebl.ownerPlatformId?.toString(),
        nextPlatform: ebl.nextPlatformId?.toString(),
        issuer: ebl.issuerId?.toString(),
        shipper: ebl.shipperId?.toString(),
        consignee: ebl.consigneeId?.toString(),
        releaseAgent: ebl.releaseAgentId?.toString(),
        issuerName: ebl.issuerId && platformNames.get(ebl.issuerId),
        shipperName: ebl.shipperId && platformNames.get(ebl.shipperId),
        consigneeName: ebl.consigneeId && platformNames.get(ebl.consigneeId),
        releaseAgentName: ebl.releaseAgentId && platformNames.get(ebl.releaseAgentId),
        ownerName: ebl.ownerPlatformId && platformNames.get(ebl.ownerPlatformId),
      }));

      return {
        list: await EBlRowSchemaList.parseAsync(result),
        total: count,
        actionRequired,
        upcoming,
        sent,
        archive,
      };
    }),

  getWithImages: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const runnable = DatabaseService.pipe(
        Effect.flatMap((db) => db.transaction()),
        Effect.flatMap((tx) =>
          Effect.promise(() => {
            return tx.eBl.findUnique({
              where: { id: input },
              include: {
                docFile: true,
                issuerPlatform: true,
                shipperPlatform: true,
                consigneePlatform: true,
                releaseAgentPlatform: true,
              },
            });
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
                allowActions: eBLAllowActions(ebl, ctx.session.platformId),
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
      };
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
          ownerPlatformId: ctx.session.platformId,
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
          where: { id: input.id, status: { in: ["UPLOADED", "DRAFT"] } },
          data: {
            ...pick(input, [
              "blNumber",
              "blType",
              "pol",
              "pod",
              "eta",
              "notes",
            ]),
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
            updatedAt: new Date(),
          },
        });
        if (!ebl) {
          throw new Error("eBl not found");
        }

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
            note: ebl.notes,
          },
        });
        await ctx.db.eBlJourney.create({
          data: {
            eBlId: ebl.id,
            action: "GRANT_CONSIGNEE",
            lastStatus: "PROCESSING",
            targetPlatformId: BigInt(input.consignee),
            sourcePlatformId: ctx.session.platformId,
            userId: ctx.session.user.id,
            note: ebl.notes,
          },
        });
        await ctx.db.eBlJourney.create({
          data: {
            eBlId: ebl.id,
            action: "GRANT_RELEASE_AGENT",
            lastStatus: "PROCESSING",
            targetPlatformId: BigInt(input.releaseAgent),
            sourcePlatformId: ctx.session.platformId,
            userId: ctx.session.user.id,
            note: ebl.notes,
          },
        });

        return ebl.id;
      });
    }),

  transfer: protectedProcedure
    .input(z.object({ id: z.string(), note: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async () => {
        const ebl = await ctx.db.eBl.findUnique({
          where: { id: input.id },
        });
        if (!ebl) {
          // TODO: implement a consistant error framework
          throw new Error("eBl not found");
        }

        // check if the eBL can be trasnferred to the next platform by current p[latform]
        if (ebl.ownerPlatformId !== ctx.session.platformId) {
          throw new Error("eBl cannot be transferred by current platform");
        }

        const sequence = [
          ebl.issuerId,
          ebl.shipperId,
          ebl.consigneeId,
          ebl.releaseAgentId,
        ];
        const index = sequence.indexOf(ebl.ownerPlatformId);
        if (index === -1) {
          throw new Error("eBl is not owned by any platform");
        }
        if (index === sequence.length - 1) {
          throw new Error("eBl is completed");
        }

        await ctx.db.eBl.update({
          where: { id: input.id },
          data: {
            ownerPlatformId: sequence[index + 1],
            nextPlatformId:
              index < sequence.length - 2 ? sequence[index + 2] : null,
            updatedAt: new Date(),
          },
        });

        await ctx.db.eBlJourney.create({
          data: {
            eBlId: ebl.id,
            action: "TRANSFER",
            lastStatus: ebl.status,
            targetPlatformId: sequence[index + 1],
            sourcePlatformId: ctx.session.platformId,
            userId: ctx.session.user.id,
            note: input.note,
          },
        });
        return ebl.id;
      });
    }),

  accomplish: protectedProcedure
    .input(z.object({ id: z.string(), note: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async () => {
        const ebl = await ctx.db.eBl.findUnique({
          where: { id: input.id },
        });
        if (!ebl) {
          // TODO: implement a consistant error framework
          throw new Error("eBl not found");
        }

        // check if the eBL can be trasnferred to the next platform by current p[latform]
        if (ebl.ownerPlatformId !== ctx.session.platformId) {
          throw new Error("eBl cannot be transferred by current platform");
        }

        const sequence = [
          ebl.issuerId,
          ebl.shipperId,
          ebl.consigneeId,
          ebl.releaseAgentId,
        ];
        const index = sequence.indexOf(ebl.ownerPlatformId);
        if (index === -1) {
          throw new Error("eBl is not owned by any platform");
        }
        if (index !== sequence.length - 1) {
          throw new Error("eBl cannot be accoplished");
        }
        const newStatus = "COMPLETED";

        await ctx.db.eBl.update({
          where: { id: input.id },
          data: {
            status: newStatus,
            updatedAt: new Date(),
          },
        });

        await ctx.db.eBlJourney.create({
          data: {
            eBlId: ebl.id,
            action: "COMPLETE",
            lastStatus: newStatus,
            targetPlatformId: ctx.session.platformId,
            sourcePlatformId: ctx.session.platformId,
            userId: ctx.session.user.id,
            note: input.note,
          },
        });
        return ebl.id;
      });
    }),
});
