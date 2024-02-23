import { ports } from "@/lib/ports";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const portRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const port = ports.find((p) => p.value === input.id);

      return port ? { label: port.name, id: port.value } : null;
    }),

  list: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(({ input }) => {
      // return ctx.db.port.findMany({
      //   orderBy: { createdAt: "desc" },
      // });

      if (input.keyword === "") return [];
      const keyword = input.keyword.toLowerCase();
      return ports
        .filter((p) => p.name.toLowerCase().includes(keyword))
        .map((p) => ({ label: p.name, id: p.value }));
    }),
});
