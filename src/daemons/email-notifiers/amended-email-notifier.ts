import { env } from "@/env";
import { currentStatus, eBlNo, lastEvent, lastNStatus } from "@/lib/ebl";
import { getLogger } from "@/lib/logger";
import { type EmailNotifier } from ".";
import {
  activePlatformUsers,
  sendStandardNotification,
  touchEmailNotification,
} from "./utils";
import { businessInfoList } from "@/server/fx/buinfo";

export const amendedEmailNotifier: EmailNotifier = async ({
  db,
  service,
  platform,
  rec,
  newStash,
}) => {
  if (
    lastNStatus(rec, 2) !== "REQUEST_AMEND" &&
    lastNStatus(rec, 1) !== "UPDATE" &&
    currentStatus(rec) !== "TRANSFER"
  ) {
    return;
  }

  // check if the platform is the current owner of the eBl
  if (platform.platformId !== rec.bl?.current_owner) {
    return;
  }

  getLogger().info(
    `Send amended notification email to platform ${platform.id} users`,
  );

  const notificationName = "amended";
  const event = lastEvent(rec);
  const number = eBlNo(rec);
  const buList = await businessInfoList();
  const sender =
    buList?.[event?.transfer?.transfer_by ?? ""]?.legalBusinessName ?? "";

  await Promise.all([
    touchEmailNotification({
      db,
      name: notificationName,
      stashId: newStash.id!,
    }),

    sendStandardNotification({
      template: notificationName,
      service,
      receivers: (await activePlatformUsers(db, platform.id)) ?? [],
      subject: `${number} has been amended`,
      companyName: platform.name,
      sender,
      eBlNo: number ?? "",
      note: event?.transfer?.note ?? "",
      url: new URL(`/ebls/${rec.bl?.id}`, env.PORTAL_URL).toString(),
    }),
  ]);
};
