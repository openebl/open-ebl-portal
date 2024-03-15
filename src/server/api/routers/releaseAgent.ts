import { platforms } from "@/lib/platforms";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const releaseAgentRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return platforms[input.id] ?? null;
    }),

  list: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(async ({ input }) => {
      // partial & case-insensitive search
      const filteredPlatforms = Object.entries(platforms)
        .filter(([_id, platform]) =>
          platform.name.toLowerCase().includes(input.keyword.toLowerCase()),
        )
        .reduce((obj, [id, platform]) => ({ ...obj, [id]: platform }), {});

      return filteredPlatforms;
    }),
});
