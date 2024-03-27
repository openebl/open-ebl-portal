import { createTRPCRouter } from "@/server/api/trpc";
import { adminPlatformRouter } from "./routers/admin-platform";
import { buinfoRouter } from "./routers/buinfo";
import { docExtreactionRouter } from "./routers/doc-extraction";
import { docFileRouter } from "./routers/doc-file";
import { docImageRouter } from "./routers/doc-image";
import { eBlRouter } from "./routers/ebl";
import { portRouter } from "./routers/port";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  port: portRouter,
  buinfo: buinfoRouter,
  ebl: eBlRouter,
  docExtreaction: docExtreactionRouter,
  docFile: docFileRouter,
  docImage: docImageRouter,
  user: userRouter,
  adminPlatform: adminPlatformRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
