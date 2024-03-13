import { platforms } from "@/lib/platforms";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const platformRouter = createTRPCRouter({
  list: protectedProcedure
    .query(({ ctx }) => {
      // TODO: fetch from cdn
      return platforms;
    }),
});
