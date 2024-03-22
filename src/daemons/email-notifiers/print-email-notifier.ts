import { env } from "@/env";
import {
  currentStatus,
  eBlNo,
  eblParties,
  lastEvent
} from "@/lib/ebl";
import { getLogger } from "@/lib/logger";
import { platforms } from "@/lib/platforms";
import { type EmailNotifier } from ".";
import {
  activePlatformUsers,
  sendStandardNotification,
  touchEmailNotification
} from "./utils";

export const printEmailNotifier: EmailNotifier = async ({
  db,
  service,
  platform,
  rec,
  newStash,
}) => {
  if (currentStatus(rec) !== "PRINT") {
    return;
  }

  // check if the platform is participated in the eBl
  const parties = eblParties(rec);
  if (
    !platform.platformId ||
    !parties ||
    !Object.values(parties).includes(platform.platformId)
  ) {
    return;
  }

  getLogger().info(`Send printed email to platform ${platform.id} users`);

  const notificationName = "printed";
  const event = lastEvent(rec);
  const number = eBlNo(rec);
  const sender = platforms[event?.print_to_paper?.print_by ?? ""]?.name ?? "";

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
      subject: `${number} has been printed`,
      companyName: platform.name,
      sender,
      eBlNo: number ?? "",
      note: event?.print_to_paper?.note ?? "",
      url: new URL(`/ebls/${rec.bl?.id}`, env.PORTAL_URL).toString(),
    }),
  ]);
};
