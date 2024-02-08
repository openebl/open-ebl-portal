import { shippers } from "@/lib/parties";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const shipperRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const shipper = shippers
        .find((p) => p.value === input.id)

      return shipper ? { label: shipper.name, id: shipper.value } : null;
    }),

    list: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(({ ctx, input }) => {
      // return ctx.db.shipper.findMany({
      //   orderBy: { createdAt: "desc" },
      // });
      const keyword = input.keyword.toLowerCase();
      return shippers
        .filter((p) => p.name.toLowerCase().includes(keyword))
        .map((p) => ({ label: p.name, id: p.value }));
    }),
});
