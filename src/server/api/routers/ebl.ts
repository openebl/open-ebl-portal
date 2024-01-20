import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Status, type EBlType } from "@/types/ebl";

export const eBlRouter = createTRPCRouter({
  all: protectedProcedure
    // .input(z.object({ text: z.string() }))
    .query(({ ctx }) => {
      return [
        { number: "BL5039271", status: Status.Draft, lastUpdated: new Date().toISOString() },
        { number: "BL50949-4", status: Status.InProgress, lastUpdated: new Date().toISOString() },
        { number: "BL000967483", status: Status.Printed, lastUpdated: new Date().toISOString() },
        { number: "BL4983-37746", status: Status.Completed, lastUpdated: new Date().toISOString() },
      ] as EBlType[]
    }),
});
