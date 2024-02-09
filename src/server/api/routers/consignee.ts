import { consignees } from "@/lib/parties";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const consigneeRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const consignee = consignees.find((p) => p.value === input.id);
      return consignee ? { label: consignee.name, id: consignee.value } : null;
    }),

  list: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(({ input }) => {
      if (input.keyword === "") return [];
      const keyword = input.keyword.toLowerCase();
      return consignees
        .filter((p) => p.name.toLowerCase().includes(keyword))
        .map((p) => ({ label: p.name, id: p.value }));
    }),
});
