import dotenv from "dotenv";
import createClient from "openapi-fetch";

import { currentStatus } from "@/lib/ebl";
import { getLogger } from "@/lib/logger";
import { sleep } from "@/lib/utils";
import { db } from "@/server/db";
import { type components, type paths } from "@/types/bu-scheme";
import { Prisma, type EBlStash, type Platform } from "@prisma/client";
import { performEmailNotifiers } from "./email-notifiers";

type EBlRecordType = components["schemas"]["BillOfLadingRecord"];

dotenv.config();
import("@/env.js")
  .then(({ env }) => {
    const logger = getLogger();

    const emailNotifyDaemon = async () => {
      logger.info("Email Notify Daemon started");

      for await (const platform of fetchPlatforms()) {
        logger.info(`Processing platform ${platform.id}`);
        for await (const chunk of fetchEBlInChunk({
          buUrl: env.BU_SERVER_URL,
          buKey: env.BU_SERVER_API_KEY,
          platform})) {
          const stashes = await latestEBlStashesByPlatformAndEBl(
            chunk,
            platform,
          );

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
            const newStash = await db.eBlStash.create({
              data: {
                eBlId: rec.bl.id,
                platformId: platform.id,
                status,
                version: rec.bl.version ?? 0,
                currentOwner: rec.bl.current_owner ?? "",
              },
            });

            await performEmailNotifiers({ platform, rec, stash, newStash });
          }
        }
      }

      await sleep(env.NOTIFIER_POLL_INTERVAL);
    };

    emailNotifyDaemon().catch(console.error);

    return null;
  })
  .catch(console.error);

async function latestEBlStashesByPlatformAndEBl(
  chunk: EBlRecordType[],
  platform: Platform,
) {
  const ids = chunk.map((rec) => rec?.bl?.id).filter((v) => !!v);
  const query = Prisma.sql`
    SELECT DISTINCT ON ("platformId", "eBlId") *
    FROM "EBlStash"
    WHERE "platformId" = ${platform.id} AND "eBlId" IN (${Prisma.join(ids)})
    ORDER BY "platformId", "eBlId", "createdAt" DESC;
  `;

  const stashes = await db.$queryRaw<EBlStash[]>(query);
  return stashes.reduce(
    (acc, stash) => {
      acc[stash.eBlId] = stash;
      return acc;
    },
    {} as Record<string, EBlStash>,
  );
}

async function* fetchPlatforms() {
  const take = 50;
  let skip = 0;
  while (true) {
    const platforms = await db.platform.findMany({
      take,
      skip,
    });

    for (const platform of platforms) {
      yield platform;
    }

    if (platforms.length < take) {
      break;
    }

    skip += take;
  }
}

async function* fetchEBlInChunk(args:{buUrl:string, buKey:string, platform: Platform}) {
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
