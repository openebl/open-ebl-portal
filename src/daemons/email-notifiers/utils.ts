import { render } from "@react-email/components";
import { type Address, type Attachment } from "nodemailer/lib/mailer";

import AccomplishNotification from "@/emails/accomplish-notification";
import ReturnNotification from "@/emails/return-notification";
import TransferNotification from "@/emails/transfer-notification";
import { getLogger } from "@/lib/logger";
import { type DatabaseType } from "@/server/db";
import { type EmailServiceType } from "@/server/services/email-service";
import { type EBlStash } from "@prisma/client";
import { isEmpty } from "remeda";

export const sendStandardNotification = async (props: {
  template: "transferred" | "accomplished" | "returned";
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
  returned: {
    header: "./public/email-returned.png",
    renderer: ReturnNotification,
  },
};
export const touchEmailNotification = async ({
  db,
  name,
  stash,
}: {
  db: DatabaseType;
  name: string;
  stash: EBlStash;
}) => {
  return db.eBlNotification
    .create({
      data: {
        name,
        eBlStashId: stash.id,
      },
    })
    .catch((err) =>
      getLogger().error(`Failed to touch eBlNotification: ${err}`),
    );
};

export const activePlatformUsers = async (
  db: DatabaseType,
  platformId: bigint,
) => {
  const platform = await db.platform.findUnique({
    where: {
      id: platformId,
    },
    include: {
      activeUsers: true,
    },
  });

  return platform?.activeUsers
    ?.filter((u) => u.email)
    ?.map((u) => ({ address: u.email!, name: u.name ?? "" }));
};
