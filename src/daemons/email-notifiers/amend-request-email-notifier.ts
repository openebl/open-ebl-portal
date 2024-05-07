import { env } from "@/env";
import { currentStatus, eBlNo, lastEvent } from "@/lib/ebl";
import { getLogger } from "@/lib/logger";
import { type EmailNotifier } from ".";
import {
  activePlatformUsers,
  sendStandardNotification,
  touchEmailNotification,
} from "./utils";
import { businessInfoList } from "@/server/fx/buinfo";

export const amendRequestEmailNotifier: EmailNotifier = async ({
  db,
  service,
  platform,
  rec,
  newStash,
}) => {
  if (currentStatus(rec) !== "REQUEST_AMEND") {
    return;
  }

  // check if the platform is the current owner of the eBl
  if (platform.platformId !== rec.bl?.current_owner) {
    return;
  }
  getLogger().info(
    `Send amend requested email to platform ${platform.id} users`,
  );

  const notificationName = "amend_requested";
  const event = lastEvent(rec);
  const number = eBlNo(rec);
  const buList = await businessInfoList();
  const sender =
    buList?.[event?.amendment_request?.request_by ?? ""]?.legalBusinessName ??
    "";

  await Promise.all([
    touchEmailNotification({
      db,
      name: notificationName,
      stash: newStash,
    }),

    sendStandardNotification({
      template: notificationName,
      service,
      receivers: (await activePlatformUsers(db, platform.id)) ?? [],
      subject: `${number} Amendment request`,
      companyName: platform.name,
      sender,
      eBlNo: number ?? "",
      note: event?.amendment_request?.note ?? "",
      url: new URL(`/ebls/${rec.bl?.id}`, env.PORTAL_URL).toString(),
    }),
  ]);
};
