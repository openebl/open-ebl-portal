import { env } from "@/env";
import { getLogger } from "@/lib/logger";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  EBlFilter,
  EBlFormSchema,
  EBlFormUpdateSchema,
  EBlFormAmendSchema,
  EBlMetadataSchema,
  type EBlRecordListType,
  type EBlRecordType,
  type EBlRequestType,
  type EBlRequestAmendType,
} from "@/types/ebl";
import { z } from "zod";

const EBlActionSchemaWithID = z.object({ id: z.string(), metadata: EBlMetadataSchema, authentication_id: z.string(), note: z.string().optional() })

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
  return await res.json() as EBlRecordType
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
      if (!ctx.session.businessUnitId || ctx.session.businessUnitId.length < 32) {
        return { records: [], total: 0 } as EBlRecordListType
      }

      const res = await fetch(`${env.BU_SERVER_URL}/ebl?offset=${input.offset}&limit=${input.limit}&status=${input.filter}&report=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.BU_SERVER_API_KEY}`,
          'X-Business-Unit-ID': String(ctx.session.businessUnitId),
        },
        cache: 'no-store'
      })
      return await res.json() as EBlRecordListType
    }),

  getByID: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const res = await fetch(`${env.BU_SERVER_URL}/ebl/${input}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.BU_SERVER_API_KEY}`,
          'X-Business-Unit-ID': String(ctx.session.businessUnitId),
        },
        cache: 'no-store'
      })
      return await res.json() as EBlRecordType
    }),

  issue: protectedProcedure
    .input(EBlFormSchema)
    .mutation(async ({ ctx, input }) => {
      const request: EBlRequestType = { ...input, authentication_id: ctx.session.authenticationId }
      request.metadata.username = ctx.session.user.name ?? '' // TODO: fill it before api call to make QA not be confused
      getLogger().info('send issue request to Doc Engine', request)
      const res = await fetch(`${env.BU_SERVER_URL}/ebl`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.BU_SERVER_API_KEY}`,
          'X-Business-Unit-ID': String(ctx.session.businessUnitId),
        },
        body: JSON.stringify(request),
        cache: 'no-store'
      })
      if (res.status === 201) {
        return await res.json() as EBlRecordType
      } else {
        throw new Error(`Failed to create EBL: ${await res.text()}`)
      }
    }),

  updateDraft: protectedProcedure
    .input(EBlFormUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { ebl_id: id, ...rest } = input;
      const request: EBlRequestType = { ...rest, authentication_id: ctx.session.authenticationId }
      request.metadata.username = ctx.session.user.name ?? ''  // TODO: fill it before api call to make QA not be confused
      getLogger().info('send issue request to Doc Engine', request)
      const res = await fetch(`${env.BU_SERVER_URL}/ebl/${id}/update`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.BU_SERVER_API_KEY}`,
          'X-Business-Unit-ID': String(ctx.session.businessUnitId),
        },
        body: JSON.stringify(request),
        cache: 'no-store'
      })
      if (res.status === 200) {
        return await res.json() as EBlRecordType
      } else {
        throw new Error(`Failed to update EBL: ${await res.text()}`)
      }
    }),

  amend: protectedProcedure
    .input(EBlFormAmendSchema)
    .mutation(async ({ ctx, input }) => {
      const { ebl_id: id, ...rest } = input;
      const request: EBlRequestAmendType = { ...rest, authentication_id: ctx.session.authenticationId }
      request.metadata.username = ctx.session.user.name ?? ''  // TODO: fill it before api call to make QA not be confused
      getLogger().info('send issue request to Doc Engine', request)
      const res = await fetch(`${env.BU_SERVER_URL}/ebl/${id}/amend`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.BU_SERVER_API_KEY}`,
          'X-Business-Unit-ID': String(ctx.session.businessUnitId),
        },
        body: JSON.stringify(request),
        cache: 'no-store'
      })
      if (res.status === 200) {
        return await res.json() as EBlRecordType
      } else {
        throw new Error(`Failed to update EBL: ${await res.text()}`)
      }
    }),

  transfer: protectedProcedure
    .input(EBlActionSchemaWithID.omit({ metadata: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, metadata: { username: ctx.session.user.name ?? '' }, authentication_id: ctx.session.authenticationId }
      return await performEBlAction({ request, action: 'transfer', business_unit_id: String(ctx.session.businessUnitId) })
    }),

  return: protectedProcedure
    .input(EBlActionSchemaWithID.omit({ metadata: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, metadata: { username: ctx.session.user.name ?? '' }, authentication_id: ctx.session.authenticationId }
      return await performEBlAction({ request, action: 'return', business_unit_id: String(ctx.session.businessUnitId) })
    }),

  surrender: protectedProcedure
    .input(EBlActionSchemaWithID.omit({ metadata: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, metadata: { username: ctx.session.user.name ?? '' }, authentication_id: ctx.session.authenticationId }
      return await performEBlAction({ request, action: 'surrender', business_unit_id: String(ctx.session.businessUnitId) })
    }),

  accomplish: protectedProcedure
    .input(EBlActionSchemaWithID.omit({ metadata: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, metadata: { username: ctx.session.user.name ?? '' }, authentication_id: ctx.session.authenticationId }
      return await performEBlAction({ request, action: 'accomplish', business_unit_id: String(ctx.session.businessUnitId) })
    }),

  print_to_paper: protectedProcedure
    .input(EBlActionSchemaWithID.omit({ metadata: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, metadata: { username: ctx.session.user.name ?? '' }, authentication_id: ctx.session.authenticationId }
      return await performEBlAction({ request, action: 'print_to_paper', business_unit_id: String(ctx.session.businessUnitId) })
    }),

  amendment_request: protectedProcedure
    .input(EBlActionSchemaWithID.omit({ metadata: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, metadata: { username: ctx.session.user.name ?? '' }, authentication_id: ctx.session.authenticationId }
      return await performEBlAction({ request, action: 'amendment_request', business_unit_id: String(ctx.session.businessUnitId) })
    }),

  delete: protectedProcedure
    .input(EBlActionSchemaWithID.omit({ metadata: true, authentication_id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = { ...input, metadata: { username: ctx.session.user.name ?? '' }, authentication_id: ctx.session.authenticationId }
      return await performEBlAction({ request, action: 'delete', business_unit_id: String(ctx.session.businessUnitId) })
    }),
});
