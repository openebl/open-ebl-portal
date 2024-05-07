import { ports } from "@/lib/ports";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const portRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const port = ports.find((p) => p.value === input.id);
      return port ? { label: port.name, value: port.value } : null;
    }),

  list: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(({ input }) => {
      // partial & case-insensitive search
      const filteredPorts = ports
        .filter(port => port.name.toLowerCase().includes(input.keyword.toLowerCase()))
        .map(port => ({ label: port.name, value: port.value }))
      return filteredPorts;
    }),
});
