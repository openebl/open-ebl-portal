import { EBlNotifications, Users } from "@/drizzle/schema";
import { render } from "@react-email/components";
import { eq } from "drizzle-orm";
import { type Address } from "nodemailer/lib/mailer";
import { isEmpty } from "remeda";

import AccomplishNotification from "@/emails/accomplish-notification";
import AmendRequestNotification from "@/emails/amend-reqeuest-notification";
import AmendedNotification from "@/emails/amended-notification";
import PrintNotification from "@/emails/print-notification";
import ReturnNotification from "@/emails/return-notification";
import TransferNotification from "@/emails/transfer-notification";
import { getLogger } from "@/lib/logger";
import { type DatabaseType } from "@/server/db";
import { type EmailServiceType } from "@/server/services/email-service";

export const sendStandardNotification = async (props: {
  template: keyof typeof emailTemplates;
  service: EmailServiceType;
  receivers: Array<string | Address>;
  subject: string;
  companyName: string;
  sender: string;
  eBlNo: string;
  note: string;
  url: string;
}) => {
  try {
    const emailTemplate = emailTemplates[props.template];
    if (!emailTemplate || isEmpty(props.receivers)) {
      return;
    }

    const logoCid = "bxlogo";
    const headerCid = "header";
    const html = render(
      emailTemplate.renderer({
        headerUrl: `cid:${headerCid}`,
        logoUrl: `cid:${logoCid}`,
        companyName: props.companyName,
        sender: props.sender,
        eBlNo: props.eBlNo,
        note: props.note,
        viewEblLink: props.url,
      }),
    );

    return props.service.send({
      to: props.receivers,
      subject: props.subject,
      html,
      attachments: [
        {
          path: "./public/bxwlogo.png",
          contentType: "image/png",
          cid: logoCid,
        },
        {
          path: emailTemplate.header,
          contentType: "image/png",
          cid: headerCid,
        },
      ],
    });
  } catch (err) {
    getLogger().error(`Failed to send email: ${JSON.stringify(err)}`);
  }
};

const emailTemplates = {
  transferred: {
    header: "./public/email-transferred.png",
    renderer: TransferNotification,
  },
  accomplished: {
    header: "./public/email-accomplished.png",
    renderer: AccomplishNotification,
  },
  printed: {
    header: "./public/email-printed.png",
    renderer: PrintNotification,
  },
  returned: {
    header: "./public/email-returned.png",
    renderer: ReturnNotification,
  },
  amend_requested: {
    header: "./public/email-amend.png",
    renderer: AmendRequestNotification,
  },
  amended: {
    header: "./public/email-amend.png",
    renderer: AmendedNotification,
  },
};

export const touchEmailNotification = async ({
  db,
  name,
  stashId,
}: {
  db: DatabaseType;
  name: string;
  stashId: bigint;
}) => {
  return db.insert(EBlNotifications).values({
        name,
        eBlStashId: stashId,
    })
    .catch((err) =>
      getLogger().error(`Failed to touch eBlNotification: ${err}`),
    );
};

export const activePlatformUsers = async (
  db: DatabaseType,
  platformId: bigint,
) => {
  const activeUsers = await db.select().from(Users).where(
      eq(Users.activePlatformId, platformId)
  ).execute();

  return activeUsers
    ?.filter((u) => u.email)
    ?.map((u) => ({ address: u.email!, name: u.name ?? "" }));
};
