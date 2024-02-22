import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const consigneeRouter = createTRPCRouter({
  get: protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const platform = await ctx.db.platform.findUnique({
      where: {
        id: BigInt(input.id),
        tradeRoles: {
          some: {
            tradeRole: "Consignee",
          },
        },
      },
    });
    return platform
      ? { label: platform.name, id: platform.id.toString() }
      : null;
  }),

  list: protectedProcedure
  .input(z.object({ keyword: z.string() }))
  .query(async ({ ctx, input }) => {
    const platforms = await ctx.db.platform.findMany({
      where: {
        tradeRoles: {
          some: {
            tradeRole: "Consignee",
          },
        },
        name: {
          contains: input.keyword,
        },
      },
    });

    return platforms.map((platform) => ({
      label: platform.name,
      id: platform.id.toString(),
    }));
  }),
});
