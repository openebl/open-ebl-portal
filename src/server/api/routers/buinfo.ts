import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { businessInfoList } from "@/server/fx/buinfo";
import { z } from "zod";

export const buinfoRouter = createTRPCRouter({
  get: protectedProcedure.input(z.string()).query(async ({ input }) => {
    const buList = await businessInfoList();
    return buList?.[input] ?? null;
  }),

  legalBusinessName: protectedProcedure.input(z.string()).query(async ({ input }) => {
    const buList = await businessInfoList();
    return buList?.[input]?.legalBusinessName ?? '';
  }),

  all: protectedProcedure.query(() => {
    return businessInfoList();
  }),

  list: protectedProcedure
    .input(z.object({ keyword: z.string().optional() }))
    .query(async ({ input }) => {
      const buList = await businessInfoList();
      if (!buList) return [];

      if (!input.keyword)
        return Object.entries(buList).map(([id, bu]) => ({ id, ...bu }));

      const filteredPlatforms = Object.entries(buList)
        .filter(([_id, bu]) =>
          bu.legalBusinessName
            ?.toLowerCase()
            .includes(input.keyword!.toLowerCase()),
        )
        .map(([id, bu]) => ({ id, ...bu }));

      return filteredPlatforms;
    }),
});
