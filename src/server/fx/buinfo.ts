import { readFile } from "fs/promises";
import NodeCache from "node-cache";
import { z } from "zod";

import { env } from "@/env";
import { getLogger } from "@/lib/logger";
import { BusinessInfoSchema } from "@/types/business-info";

const memoryCache = new NodeCache();
const BusinessInfoListSchema = z.record(z.string(), BusinessInfoSchema);

export type BusinessInfoListType = z.infer<typeof BusinessInfoListSchema>;

export const businessInfoList: () => Promise<BusinessInfoListType | null> =
  async () => {
    const list = memoryCache.get<BusinessInfoListType>("businessInfoList");
    if (list) return list;

    const content = await fetchBusinessInfoFile();
    if (!content) return null;

    const parsed = BusinessInfoListSchema.safeParse(JSON.parse(content));
    if (!parsed.success) {
      getLogger().error(
        `Invalid business info list JSON: ${parsed.error.errors.map(s => `${s.message} - ${s.path.join('/')}`).join("; ")}`,
      );
      return null;
    }

    memoryCache.set("businessInfoList", parsed.data, 60 * 60);
    return parsed.data;
  };

const fetchBusinessInfoFile = async () => {
  if (process.env.NODE_ENV === "test") {
    const content = readFile(
      "./src/test/integration/fixtures/business-info-list.json",
      { encoding: "utf8" },
    );
    return content;
  }

  const res = await fetch(env.BU_INFO_LIST_URL, { cache: "no-store" }).catch(
    (e) => {
      getLogger().error(`Cannot fetching business info list: ${e}`);
      return null;
    },
  );

  if (!res?.ok) {
    getLogger().error(
      `Invalid business info list JSON: ${res?.status} ${res?.statusText}`,
    );
    return null;
  }

  return res.text();
};
