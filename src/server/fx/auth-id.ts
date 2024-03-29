import createClient from "openapi-fetch";
import NodeCache from "node-cache";

import { env } from "@/env";
import { getLogger } from "@/lib/logger";
import { type Platform } from "@prisma/client";
import { type paths } from "@/types/bu-scheme";

const memoryCache = new NodeCache({stdTTL: 60 * 60, checkperiod: 10 * 60, maxKeys: 1000});

export const authenticationId: (
  platform: Platform,
) => Promise<string | null> = async (platform) => {
  if (!platform.platformId || platform.platformId.length === 0)
    return Promise.resolve(null);

  const authId = memoryCache.get<string>(platform.platformId);
  if (authId) return authId;

  getLogger().info(
    `Fetching active authentication for platform ${platform.id}`,
  );

  const latestAuthId = await fetchAutheticationId(platform.platformId).catch(
    (err) => {
      getLogger().error(`cannot fetch active authentication: ${err}`);
      return '';
    },
  );

  if (latestAuthId.length === 0) return null;

  getLogger().info(`Got active authentication for platform ${platform.id}`);
  memoryCache.set(platform.platformId, latestAuthId, 60 * 60);

  return latestAuthId;
};

const fetchAutheticationId = async (businessUnitId: string) => {
  const client = createClient<paths>({
    baseUrl: env.BU_SERVER_URL,
  });

  const { data, error } = await client.GET("/business_unit/{id}", {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.BU_SERVER_API_KEY}`,
    },
    params: { path: { id: businessUnitId } },
  });
  if (error) throw error;
  if (!data) throw new Error("No data found");

  // find first authentications which status is active
  const activeAuthentication = data.authentications?.find(
    (auth) => auth.status === "active",
  );

  if (!activeAuthentication) {
    throw new Error("No active authentication found");
  }
  return activeAuthentication.id ?? '';
};
