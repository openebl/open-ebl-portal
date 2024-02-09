import { createTRPCRouter } from "@/server/api/trpc";
import { platformRouter } from "./routers/platform";
import { eBlRouter } from "./routers/ebl";
import { shipperRouter } from "./routers/shipper";
import { portRouter } from "./routers/port";
import { consigneeRouter } from "./routers/consignee";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  platform: platformRouter,
  port: portRouter,
  shipper: shipperRouter,
  consignee: consigneeRouter,
  ebl: eBlRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
