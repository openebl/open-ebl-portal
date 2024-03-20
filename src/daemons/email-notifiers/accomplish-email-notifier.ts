import AccomplishNotification from "@/emails/accomplish-notification";
import { env } from "@/env";
import { currentStatus, lastEvent, latestBillOfLading } from "@/lib/ebl";
import { getLogger } from "@/lib/logger";
import { platforms } from "@/lib/platforms";
import { render } from "@react-email/render";
import { type EmailNotifier } from ".";
import { touchAndSendEmailToPlatformUsers } from "./utils";

export const accomplishEmailNotifier: EmailNotifier = async ({
  db,
  service,
  platform,
  rec,
  newStash,
}) => {
  if (currentStatus(rec) !== 'ACCOMPLISH') {
    return;
  }

  // check if the platform is the current owner of the eBl
  if (platform.platformId !== rec.bl?.current_owner) {
    return;
  }
  getLogger().info(`Send accomplished email to platform ${platform.id} users`);

  const event = lastEvent(rec);
  const latestBl = latestBillOfLading(rec);
  const logoCid = "bxlogo";
  const headerCid = "header";
  const sender = platforms[event?.accomplish?.accomplish_by ?? ""]?.name ?? "";
  const html = render(
    AccomplishNotification({
      headerUrl: `cid:${headerCid}`,
      logoUrl: `cid:${logoCid}`,
      companyName: platform.name,
      sender,
      eBlNo: latestBl?.transportDocumentReference ?? "",
      note: event?.transfer?.note ?? "",
      viewEblLink: new URL(`/ebl/${rec.bl?.id}`, env.PORTAL_URL).toString(),
    }),
  );

  await touchAndSendEmailToPlatformUsers({
    db,
    service,
    notificationName: "accomplished",
    platformId: platform.id,
    stash: newStash,
    subject: `${sender} has accomplished eBL ${latestBl?.transportDocumentReference}`,
    html,
    attachments: [
      {
        path: "./public/bxwlogo.png",
        contentType: "image/png",
        cid: logoCid,
      },
      {
        path: "./public/email-accomplished.png",
        contentType: "image/png",
        cid: headerCid,
      },
    ],
  });
};
