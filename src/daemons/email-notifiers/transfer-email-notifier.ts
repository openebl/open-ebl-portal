import TransferNotification from "@/emails/transfer-notification";
import { env } from "@/env";
import { currentStatus, lastEvent, latestBillOfLading } from "@/lib/ebl";
import { getLogger } from "@/lib/logger";
import { platforms } from "@/lib/platforms";
import { render } from "@react-email/render";
import { type EmailNotifier } from ".";
import { touchAndSendEmailToPlatformUsers } from "./utils";

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

  const event = lastEvent(rec);
  const latestBl = latestBillOfLading(rec);
  const logoCid = "bxlogo";
  const headerCid = "header";
  const sender = platforms[event?.transfer?.transfer_by ?? ""]?.name ?? "";
  const html = render(
    TransferNotification({
      headerUrl: `cid:${headerCid}`,
      logoUrl: `cid:${logoCid}`,
      companyName: platform.name,
      sender,
      eBlNo: latestBl?.transportDocumentReference ?? "",
      note: event?.transfer?.note ?? "",
      viewEblLink: new URL(`/ebls/${rec.bl?.id}`, env.PORTAL_URL).toString(),
    }),
  );

  await touchAndSendEmailToPlatformUsers({
    db,
    service,
    notificationName: "transferred",
    platformId: platform.id,
    stash: newStash,
    subject: `${sender} has transferred eBL ${latestBl?.transportDocumentReference} to your company`,
    html,
    attachments: [
      {
        path: "./public/bxwlogo.png",
        contentType: "image/png",
        cid: logoCid,
      },
      {
        path: "./public/email-transferred.png",
        contentType: "image/png",
        cid: headerCid,
      },
    ],
  });
};
