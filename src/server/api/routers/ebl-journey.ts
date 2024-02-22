import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { EBlJourneyRowListSchema } from "@/types/ebl";
import { isTruthy } from "remeda";

export const eBlJourneyRouter = createTRPCRouter({
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const journey = await ctx.db.eBlJourney.findMany({
      where: { eBlId: input },
      orderBy: { createdAt: "asc" },
    });
    const user = await ctx.db.user.findMany({
      select: { id: true, name: true, email: true },
      where: { id: { in: journey.map((j) => j.userId).filter(isTruthy) } },
    });
    const userMap = user.reduce((acc, u) => {
      acc.set(u.id, u);
      return acc;
    }, new Map<bigint, { name: string | null; email: string | null }>());

    const res = journey.map((j) => ({
      ...j,
      sourcePlatform: j.sourcePlatformId?.toString(),
      targetPlatform: j.targetPlatformId?.toString(),
      user: j.userId ? { ...userMap.get(j.userId) } : null,
    }));

    return EBlJourneyRowListSchema.parseAsync(res);
  }),
});
