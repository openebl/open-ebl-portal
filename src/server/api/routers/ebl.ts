import { z } from "zod";
import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getDocImagesByDocFileId } from "@/server/fx/doc-image";
import {
  EBlRecordSchema,
  EBlRecordListSchema,
  EBlRequestSchema,
  EBlFilter,
  type EBlRecordType,
  type EBlRecordListType,
} from "@/types/ebl";

const EBlActionSchemaWithID = z.object({ id: z.string(), meta_data: z.string(), authentication_id: z.string(), note: z.string().optional() })

type EBlActionSchemaWithIDType = z.infer<typeof EBlActionSchemaWithID>

const performEBlAction = async (payload: { request: EBlActionSchemaWithIDType, action: string, business_unit_id: string }) => {
  const { request, action, business_unit_id } = payload
  const { id, ...rest } = request;
  const body = JSON.stringify(rest)
  const res = await fetch(`${env.BU_SERVER_URL}/ebl/${id}/${action}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.BU_SERVER_API_KEY}`,
      'X-Business-Unit-ID': business_unit_id,
    },
    body,
    cache: 'no-store'
  })
  const data = await res.json() as EBlRecordType
  const result = EBlRecordSchema.parse(data)
  return result
}

export const eBlRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        offset: z.number().optional().default(0),
        limit: z.number().optional().default(10),
        filter: z.string().optional().default(EBlFilter.ACTION_NEEDED),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await fetch(`${env.BU_SERVER_URL}/ebl?offset=${input.offset}&limit=${input.limit}&status=${input.filter}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.BU_SERVER_API_KEY}`,
          'X-Business-Unit-ID': String(ctx.session.platform.platformId),
        },
        cache: 'no-store'
      })
      const data = await res.json() as EBlRecordListType
      const result = EBlRecordListSchema.parse(data)
      return result
    }),

  getByID: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const res = await fetch(`${env.BU_SERVER_URL}/ebl/${input}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.BU_SERVER_API_KEY}`,
          'X-Business-Unit-ID': String(ctx.session.platform.platformId),
        },
        cache: 'no-store'
      })
      const data = await res.json() as EBlRecordType
      const result = EBlRecordSchema.parse(data)
      return result
    }),

  new: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      // TODO: get_doc_ai_extraction
      const ebl = await ctx.db.eBl.findUnique({
        where: { id: input },
        include: {
          docFile: true,
          issuerPlatform: true,
          shipperPlatform: true,
          consigneePlatform: true,
          releaseAgentPlatform: true,
        },
      });
      if (!ebl) return null;

      const request = {
        meta_data: ctx.session.user.name ?? '',
        authentication_id: String(ctx.session.authentication_id),
        file: {
          name: "name3",
          type: "type3",
          content: "Y29udGVudDI="
        },
        bl_number: "DEMO0001",
        bl_doc_type: "HouseBillOfLading",
        to_order: false,
        pol: {
          locationName: "Yantian, CN, CNYTN",
          UNLocationCode: "CNYTN"
        },
        pod: {
          locationName: "Los Angeles, CA, US, USLAX",
          UNLocationCode: "USLAX"
        },
        shipper: "did:openebl:d2856f4e-e636-4cf0-9110-fbb45304e614",
        consignee: "did:openebl:0158341d-5c6b-4121-bfe4-535c7606bbd5",
        release_agent: "did:openebl:66c71465-3d0b-43d8-9e1b-c88c7a7634ca",
        note: "",
        draft: false
      }

      const images = await getDocImagesByDocFileId(
        ctx.db,
        ctx.storageService,
        ebl.docFileId!,
      )

      return {
        ebl: EBlRequestSchema.parse(request),
        images,
      };
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

  issue: protectedProcedure
    .input(EBlRequestSchema.omit({ meta_data: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, meta_data: ctx.session.user.name ?? '', authentication_id: ctx.session.authentication_id }
      const res = await fetch(`${env.BU_SERVER_URL}/ebl`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.BU_SERVER_API_KEY}`,
          'X-Business-Unit-ID': String(ctx.session.platform.platformId),
        },
        body: JSON.stringify(request),
        cache: 'no-store'
      })
      const data = await res.json() as EBlRecordType
      const result = EBlRecordSchema.parse(data)
      return result
    }),

  transfer: protectedProcedure
    .input(EBlActionSchemaWithID.omit({ meta_data: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, meta_data: ctx.session.user.name ?? '', authentication_id: ctx.session.authentication_id }
      return await performEBlAction({ request, action: 'transfer', business_unit_id: String(ctx.session.platform.platformId) })
    }),

  return: protectedProcedure
    .input(EBlActionSchemaWithID.omit({ meta_data: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, meta_data: ctx.session.user.name ?? '', authentication_id: ctx.session.authentication_id }
      return await performEBlAction({ request, action: 'return', business_unit_id: String(ctx.session.platform.platformId) })
    }),

  surrender: protectedProcedure
    .input(EBlActionSchemaWithID.omit({ meta_data: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, meta_data: ctx.session.user.name ?? '', authentication_id: ctx.session.authentication_id }
      return await performEBlAction({ request, action: 'surrender', business_unit_id: String(ctx.session.platform.platformId) })
    }),

  accomplish: protectedProcedure
    .input(EBlActionSchemaWithID.omit({ meta_data: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, meta_data: ctx.session.user.name ?? '', authentication_id: ctx.session.authentication_id }
      return await performEBlAction({ request, action: 'accomplish', business_unit_id: String(ctx.session.platform.platformId) })
    }),

  print_to_paper: protectedProcedure
    .input(EBlActionSchemaWithID.omit({ meta_data: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, meta_data: ctx.session.user.name ?? '', authentication_id: ctx.session.authentication_id }
      return await performEBlAction({ request, action: 'print_to_paper', business_unit_id: String(ctx.session.platform.platformId) })
    }),

  amendment_request: protectedProcedure
    .input(EBlActionSchemaWithID.omit({ meta_data: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, meta_data: ctx.session.user.name ?? '', authentication_id: ctx.session.authentication_id }
      return await performEBlAction({ request, action: 'amendment_request', business_unit_id: String(ctx.session.platform.platformId) })
    }),

  delete: protectedProcedure
    .input(EBlActionSchemaWithID.omit({ meta_data: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, meta_data: ctx.session.user.name ?? '', authentication_id: ctx.session.authentication_id }
      return await performEBlAction({ request, action: 'delete', business_unit_id: String(ctx.session.platform.platformId) })
    }),
});
