import { env } from "@/env";
import { getLogger } from "@/lib/logger";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  EBlFilter,
  EBlFormSchema,
  EBlRecordListSchema,
  EBlRecordSchema,
  type EBlRecordListType,
  type EBlRecordType
} from "@/types/ebl";
import { z } from "zod";

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

  issue: protectedProcedure
    .input(EBlFormSchema)
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, meta_data: ctx.session.user.name ?? '', authentication_id: ctx.session.authentication_id }
      getLogger().info('send issue request to Doc Engine', request)
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
      if (res.status === 201) {
        const data = await res.json() as EBlRecordType
        const result = EBlRecordSchema.parse(data)
        return result
      } else {
        throw new Error(`Failed to create EBL: ${await res.text()}`)
      }
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
