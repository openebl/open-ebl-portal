import { createTRPCRouter } from "@/server/api/trpc";
import { consigneeRouter } from "./routers/consignee";
import { docExtreactionRouter } from "./routers/doc-extraction";
import { docImageRouter } from "./routers/doc-image";
import { eBlRouter } from "./routers/ebl";
import { platformRouter } from "./routers/platform";
import { portRouter } from "./routers/port";
import { releaseAgentRouter } from "./routers/releaseAgent";
import { shipperRouter } from "./routers/shipper";
import { docFileRouter } from "./routers/doc-file";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  port: portRouter,
  platform: platformRouter,
  shipper: shipperRouter,
  consignee: consigneeRouter,
  releaseAgent: releaseAgentRouter,
  ebl: eBlRouter,
  docExtreaction: docExtreactionRouter,
  docFile: docFileRouter,
  docImage: docImageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
