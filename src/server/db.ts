import { type Prisma, PrismaClient } from "@prisma/client";

import { env } from "@/env";
import { getLogger } from "@/lib/logger";

const createDefaultDb = () => {
  const prisma = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "event",
        level: "error",
      },
      {
        emit: "event",
        level: "info",
      },
      {
        emit: "event",
        level: "warn",
      },
    ],
  });

  prisma.$on("query", (e) => {
    getLogger().debug(`Query [${e.duration}ms]: ${e.query}; ${e.params}`);
  });
  prisma.$on("error", (e) => {
    getLogger().error(`[${e.target}] ${e.message}`);
  });
  prisma.$on("warn", (e) => {
    getLogger().warn(`[${e.target}] ${e.message}`);
  });
  prisma.$on("info", (e) => {
    getLogger().info(`[${e.target}] ${e.message}`);
  });

  return prisma;
}

const createCustomDb = (opts: { datasourceUrl?: string, log?: (Prisma.LogLevel | Prisma.LogDefinition)[] }) => {
  return new PrismaClient(opts);
}

export const createDb = (opts?: { datasourceUrl?: string, log?: (Prisma.LogLevel | Prisma.LogDefinition)[] }) => {
  const prisma = !opts ? createDefaultDb() : createCustomDb(opts);

  return prisma.$extends({
    query: {
      async $allOperations({ model, operation, args, query }) {
        const start = performance.now();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await query(args);
        const end = performance.now();
        const time = (end - start).toFixed(2);
        model && getLogger().info(`Query ${model}.${operation} took ${time} ms`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
      },
    },
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createDb>;
};

export const db = globalForPrisma.prisma ?? createDb();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
