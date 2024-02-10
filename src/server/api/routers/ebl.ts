import { InternalServerError, NotFoundError } from "@/lib/errors";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { EBlListSchema } from "@/types/ebl";
import { TRPCError } from "@trpc/server";
import { readFile } from "fs/promises";
import { z } from "zod";

type SaveDraftInput = Record<string, unknown>;

export const eBlRouter = createTRPCRouter({
  all: protectedProcedure
    // .input(z.object({ text: z.string() }))
    .query(async ({ ctx }) => {
      const content = await readFile(
        './src/test/fixtures/full-ebl-list.json',
        { encoding: 'utf8' }
      );

      const parsed = EBlListSchema.safeParse(JSON.parse(content))
      if (!parsed.success) {
        throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: `Invalid EBL list: ${parsed.error.message}`})
      }

      return parsed.data;
    }),

  find: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const content = await readFile(
        './src/test/fixtures/full-ebl-list.json',
        { encoding: 'utf8' }
      );

      const parsed = EBlListSchema.safeParse(JSON.parse(content))
      if (!parsed.success) {
        throw new InternalServerError(`Invalid EBL list: ${parsed.error.message}`)
      }

      const ebl = parsed.data.find((ebl) => ebl.blNumber === input);
      if (!ebl) {
        throw new NotFoundError();
      }

      return ebl;
    }),

  saveDraft: protectedProcedure
    .input(z.object({}).passthrough())
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      return {};
      // return ctx.db.platform.create({
      //   data: {
      //     name: input,
      //   },
      // });
    }),

  });
