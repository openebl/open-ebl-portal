import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { EBlListSchema } from "@/types/ebl";
import { readFile } from "fs/promises";

export const eBlRouter = createTRPCRouter({
  all: protectedProcedure
    // .input(z.object({ text: z.string() }))
    .query(async ({ ctx }) => {
      const content = await readFile(
        './src/test/fixtures/full-ebl-list.json',
        { encoding: 'utf8' }
      );

      return EBlListSchema.parseAsync(JSON.parse(content))
    }),
});
