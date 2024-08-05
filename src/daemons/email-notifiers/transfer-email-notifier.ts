import { env } from "@/env";
import { currentStatus, eBlNo, lastEvent } from "@/lib/ebl";
import { getLogger } from "@/lib/logger";
import { businessInfoList } from "@/server/fx/buinfo";
import { type EmailNotifier } from ".";
import {
  activePlatformUsers,
  sendStandardNotification,
  touchEmailNotification,
} from "./utils";

export const transferEmailNotifier: EmailNotifier = async ({
  db,
  service,
  platform,
  rec,
  newStash,
}) => {
  if (!["TRANSFER", "SURRENDER"].includes(currentStatus(rec))) {
    return;
  }

  // check if the platform is the current owner of the eBl
  if (platform.platformId !== rec.bl?.current_owner) {
    return;
  }
  getLogger().info(`Send transferred email to platform ${platform.id} users`);

  const buList = await businessInfoList();
  const notificationName = "transferred";
  const event = lastEvent(rec);
  const number = eBlNo(rec);
  const sender = buList?.[event?.transfer?.transfer_by ?? ""]?.legalBusinessName ?? "";

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
      subject: `${number} has been issued to you`,
      companyName: platform.name,
      sender,
      eBlNo: number ?? "",
      note: event?.transfer?.note ?? "",
      url: new URL(`/ebls/${rec.bl?.id}`, env.PORTAL_URL).toString(),
    }),
  ]);
};
