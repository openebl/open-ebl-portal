import { currentStatus } from "@/lib/ebl";
import { getLogger } from "@/lib/logger";
import { type EmailNotifier } from ".";
import { touchEmailNotification } from "./utils";

export const transferEmailNotifier:EmailNotifier = async ({ platform, rec, newStash }) => {
  if (!["TRANSFER", "SURRENDER"].includes(currentStatus(rec))) {
    return;
  }

  // check if the platform is the current owner of the eBl
  if (platform.platformId === rec.bl?.current_owner) {
    getLogger().info(`Send transferred email to platform ${platform.id} users`);

    // TODO: send email
    touchEmailNotification("transferred", newStash).catch(getLogger().error);
  }
}