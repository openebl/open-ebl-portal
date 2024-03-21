import { env } from "@/env";
import { currentStatus, lastEvent, latestBillOfLading } from "@/lib/ebl";
import { getLogger } from "@/lib/logger";
import { platforms } from "@/lib/platforms";
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

  const notificationName = "transferred";
  const event = lastEvent(rec);
  const latestBl = latestBillOfLading(rec);
  const sender = platforms[event?.transfer?.transfer_by ?? ""]?.name ?? "";

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
      subject: `${sender} has transferred eBL ${latestBl?.transportDocumentReference} to your company`,
      companyName: platform.name,
      sender,
      eBlNo: latestBl?.transportDocumentReference ?? "",
      note: event?.transfer?.note ?? "",
      url: new URL(`/ebls/${rec.bl?.id}`, env.PORTAL_URL).toString(),
    }),
  ]);
};
