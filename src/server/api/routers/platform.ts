import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const platformRouter = createTRPCRouter({
  all: protectedProcedure
    // .input(z.object({ text: z.string() }))
    .query(({ ctx }) => {
      return ctx.db.platform.findMany({
        orderBy: { createdAt: "desc" },
      });
    }),
});
