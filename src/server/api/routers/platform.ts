import { platforms } from "@/lib/platforms";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const platformRouter = createTRPCRouter({
  list: protectedProcedure
    .query(() => {
      // TODO: fetch from cdn
      return platforms;
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(({ input }) => {
      // TODO: fetch from cdn
      return platforms[input];
    }),
});
