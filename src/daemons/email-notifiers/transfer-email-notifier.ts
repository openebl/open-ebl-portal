import TransferNotification from "@/emails/transfer-notification";
import { env } from "@/env";
import { currentStatus, lastEvent, latestBillOfLading } from "@/lib/ebl";
import { getLogger } from "@/lib/logger";
import { platforms } from "@/lib/platforms";
import { render } from "@react-email/render";
import { type EmailNotifier } from ".";
import { touchEmailNotification } from "./utils";

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
  const content = render(
    TransferNotification({
      headerUrl: `cid:${headerCid}`,
      logoUrl: `cid:${logoCid}`,
      companyName: platform.name,
      sender,
      eBlNo: latestBl?.transportDocumentReference ?? "",
      note: event?.transfer?.note ?? "",
      viewEblLink: new URL(`/ebl/${rec.bl?.id}`, env.PORTAL_URL).toString(),
    }),
  );

  const p = await db.platform.findUnique({
    where: {
      id: platform.id,
    },
    include: {
      activeUsers: true,
    },
  });

  const touching = touchEmailNotification({
    db,
    name: "transferred",
    stash: newStash,
  }).catch(getLogger().error);

  const receivers = p?.activeUsers
    ?.filter((u) => u.email)
    ?.map((u) => ({ address: u.email!, name: u.name ?? "" }));

  const sending =
    receivers &&
    receivers.length > 0 &&
    service
      .send({
        receivers,
        subject: `${sender} has transferred eBL ${latestBl?.transportDocumentReference} to your company`,
        content,
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
      })
      .catch(getLogger().error);

  await Promise.all([touching, sending]);
};
