import dotenv from "dotenv";
import { type InferSelectModel, sql } from "drizzle-orm";
import createClient from "openapi-fetch";

import { EBlStashes, type Platforms } from "@/drizzle/schema";
import { currentStatus } from "@/lib/ebl";
import { getLogger } from "@/lib/logger";
import { sleep } from "@/lib/utils";
import { db } from "@/server/db";
import { SmtpEmailService } from "@/server/services/email-service";
import { type components, type paths } from "@/types/bu-scheme";
import { performEmailNotifiers } from "./email-notifiers";

type EBlRecordType = components["schemas"]["BillOfLadingRecord"];

const logger = getLogger();

dotenv.config();
import("@/env.js")
  .then(({ env }) => {
    logger.info("Email Notify Daemon started");

    emailNotifyDaemon({
      serverUrl: env.BU_SERVER_URL,
      serverApiKey: env.BU_SERVER_API_KEY,
      notifierPollInterval: env.NOTIFIER_POLL_INTERVAL,
    }).catch((err) => logger.error(`Email notify daemon error: ${err}`));

    return null;
  })
  .catch((err) => logger.error(`Failed to start email notify daemon: ${err}`));

type DaemonArgs = {
  serverUrl: string;
  serverApiKey: string;
  notifierPollInterval: number;
};

async function emailNotifyDaemon(args: DaemonArgs) {
  while (true) {
    await pollingEBls(args).catch((err) =>
      logger.error(`Polling EBls error: ${err}`),
    );
    await sleep(args.notifierPollInterval);
  }
}

async function pollingEBls(args: DaemonArgs) {
  logger.info("Polling EBls");
  for await (const platform of fetchPlatforms()) {
    logger.info(`Processing platform ${platform.id}`);

    if (!platform.platformId) {
      logger.info(`Platform ${platform.id} has no platformId. Skipping`);
      continue;
    }

    await pollingPlatformEBls({
      platform,
      ...args,
    }).catch((err) =>
      logger.error(`Polling platform ${platform.id} error: ${err}`),
    );
  }
}

async function pollingPlatformEBls({
  platform,
  serverUrl,
  serverApiKey,
}: {
  platform: InferSelectModel<typeof Platforms>;
  serverUrl: string;
  serverApiKey: string;
}) {
  for await (const chunk of fetchEBlInChunk({
    buUrl: serverUrl,
    buKey: serverApiKey,
    platform,
  })) {
    const stashes = await latestEBlStashesByPlatformAndEBl(chunk, platform);

    for (const rec of chunk) {
      if (!rec?.bl?.id) continue;

      const stash = stashes[rec.bl.id];
      const status = currentStatus(rec);

      // check if bl status or owner has changed
      if (
        stash?.status === status ||
        stash?.currentOwner === rec.bl?.current_owner
      ) {
        continue; // no change. ignore it
      }

      // process changed eBl through email notifiers
      logger.info(
        `Processing changed eBl ${rec.bl?.id}. status: ${stash?.status ?? "-"} => ${status}, owner: ${stash?.currentOwner ?? "-"} => ${rec.bl?.current_owner ?? ""}`,
      );

      // create a new stash record
      const [newStash] = await db.insert(EBlStashes).values({
        eBlId: rec.bl.id,
        platformId: platform.id,
        status,
        version: rec.bl.version ?? 0,
        currentOwner: rec.bl.current_owner ?? "",
      }).returning();

      await performEmailNotifiers({
        db,
        service: SmtpEmailService,
        platform,
        rec,
        stash,
        newStash: newStash!,
      });
    }
  }
}

async function latestEBlStashesByPlatformAndEBl(
  chunk: EBlRecordType[],
  platform: InferSelectModel<typeof Platforms>,
): Promise<Record<string, typeof EBlStashes.$inferSelect>> {
  const ids = chunk.map((rec) => rec?.bl?.id).filter((v) => !!v);
  if (ids.length === 0) return {};

  const query = sql`
    SELECT DISTINCT ON ("platformId", "eBlId") *
    FROM "EBlStash"
    WHERE "platformId" = ${platform.id} AND "eBlId" IN (${sql.join(ids, sql`,`)})
    ORDER BY "platformId", "eBlId", "createdAt" DESC;
  `;

  const stashes = await db.execute<typeof EBlStashes.$inferSelect>(query);
  return stashes.reduce(
    (acc, stash) => {
      acc[stash.eBlId] = stash;
      return acc;
    },
    {} as Record<string, typeof EBlStashes.$inferSelect>,
  );
}

async function* fetchPlatforms() {
  const limit = 50;
  let offset = 0;
  while (true) {
    const platforms = await db.query.Platforms.findMany({
      limit,
      offset,
    });

    for (const platform of platforms) {
      yield platform;
    }

    if (platforms.length < limit) {
      break;
    }

    offset += limit;
  }
}

async function* fetchEBlInChunk(args: {
  buUrl: string;
  buKey: string;
  platform: InferSelectModel<typeof Platforms>;
}) {
  let offset = 0;
  const limit = 50;
  const client = createClient<paths>({ baseUrl: args.buUrl });

  while (true) {
    const { data, error } = await client.GET("/ebl", {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${args.buKey}`,
        "X-Business-Unit-ID": args.platform.platformId,
      },
      params: {
        query: {
          offset,
          limit: limit,
          filters: "ACTION_NEEDED",
        },
      },
    });

    if (error) {
      throw error;
    }

    if (!data.records) {
      break; // blank response
    }

    yield data.records;

    if (data.records?.length < limit) {
      break; // No more data to fetch
    }

    offset += limit;
  }
}
