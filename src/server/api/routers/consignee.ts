import { platforms } from "@/lib/platforms";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import type { Platforms } from '@/types/platform';

export const consigneeRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return platforms[input.id] ?? null;
    }),

  list: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(async ({ ctx, input }) => {
      // partial & case-insensitive search
      const filteredPlatforms: Platforms = Object.entries(platforms)
        .filter(([_id, platform]) => platform.name.toLowerCase().includes(input.keyword.toLowerCase()))
        .reduce((obj, [id, platform]) => ({ ...obj, [id]: platform }), {});

      return filteredPlatforms;
    }),
});
