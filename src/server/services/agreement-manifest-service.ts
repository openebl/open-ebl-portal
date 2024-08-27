import { z } from "zod";

import { env } from "@/env";
import { getLogger } from "@/lib/logger";
import { joinUrls } from "@/lib/utils";

const AgreementManifestZod = z.object({
  service: z.string(),
  name: z.string(),
  version: z.number().int().positive(),
  url: z.string(),
})

const AgreementManifestFileZod = z.object({
  agreements: z.array(AgreementManifestZod)
})

type AgreementManifest = z.infer<typeof AgreementManifestZod>;

export type AgreementManifestServiceType = {
  readonly get: () => Promise<AgreementManifest[]>;
};

const manifestCache = {
  list: [] as AgreementManifest[],
  lastUpdated: 0,
};

const updateManifestCache = async () => {
  try {
    if (manifestCache.lastUpdated > Date.now() - 1000 * 60 * 60) {
      return;
    }

    getLogger().info(`Reading EBl Agreement Manifest from ${env.AGREEMENT_MANIFEST_URL}`);
    const res = await fetch(env.AGREEMENT_MANIFEST_URL)
    const manifests = AgreementManifestFileZod.safeParse(await res.json())
    if (!manifests.success) {
      getLogger().error(`Validation failed: ${JSON.stringify(manifests.error.format())}`);
      return;
    }

    getLogger().info(`Agreements: ${JSON.stringify(manifests.data.agreements)}`);
    manifestCache.list = manifests.data.agreements.filter((a) => a.service === "bluex_ebl").map((a) => ({
      ...a,
      url: joinUrls(env.AGREEMENT_MANIFEST_URL, a.url) + '/raw',
    }));
    manifestCache.lastUpdated = Date.now();

    getLogger().info(`Got ${manifestCache.list.length} EBl Agreement Items`);
  }catch (err) {
    getLogger().error(`Failed to fetch agreement manifest: ${String(err)}`);
    return;
  }
}

export const EBlAgreementManifestService: AgreementManifestServiceType = {
  async get() : Promise<AgreementManifest[]> {
    getLogger().info(`Get EBl Agreement Manifest from ${env.AGREEMENT_MANIFEST_URL}`);
    await updateManifestCache();
    return manifestCache.list;
  }
};

// For testing purposes
export function flushCache() {
  manifestCache.lastUpdated = 0;
  manifestCache.list = [];
}
