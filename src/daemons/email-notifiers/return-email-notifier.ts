import { env } from "@/env";
import { currentStatus, eBlNo, eblParties, lastEvent } from "@/lib/ebl";
import { getLogger } from "@/lib/logger";
import { platforms } from "@/lib/platforms";
import { type EmailNotifier } from ".";
import {
  activePlatformUsers,
  sendStandardNotification,
  touchEmailNotification,
} from "./utils";

export const returnEmailNotifier: EmailNotifier = async ({
  db,
  service,
  platform,
  rec,
  newStash,
}) => {
  if (currentStatus(rec) !== "RETURN") {
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

  // check if the platform is the current owner of the eBl
  if (platform.platformId !== rec.bl?.current_owner) {
    return;
  }

  getLogger().info(`Send returned email to platform ${platform.id} users`);

  const notificationName = "returned";
  const event = lastEvent(rec);
  const number = eBlNo(rec);
  const sender = platforms[event?.return?.return_by ?? ""]?.name ?? "";

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
      subject: `${number} has been returned to you`,
      companyName: platform.name,
      sender,
      eBlNo: number ?? "",
      note: event?.return?.note ?? "",
      url: new URL(`/ebls/${rec.bl?.id}`, env.PORTAL_URL).toString(),
    }),
  ]);
};
