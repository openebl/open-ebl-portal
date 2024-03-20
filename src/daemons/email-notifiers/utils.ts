import nodemailer from "nodemailer";

import { env } from "@/env";
import { getLogger } from "@/lib/logger";
import { type DatabaseType } from "@/server/db";
import { type EmailServiceType } from "@/server/services/email-service";
import { type EBlStash } from "@prisma/client";
import { type Address, type Attachment } from "nodemailer/lib/mailer";

export const sendNotification = async (props: {
  receivers: Address | Array<string | Address>;
  subject: string;
  content: string;
  attachments: Attachment[];
}) => {
  const transporter = nodemailer.createTransport({
    url: env.EMAIL_SERVER,
  });
  return transporter.sendMail({
    from: env.EMAIL_FROM,
    ...props,
  });
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
  return db.eBlNotification.create({
    data: {
      name,
      eBlStashId: stash.id,
    },
  });
};

export const touchAndSendEmailToPlatformUsers = async ({
  db,
  service,
  notificationName,
  platformId,
  stash,
  subject,
  html,
  text,
  attachments,
}: {
  db: DatabaseType;
  service: EmailServiceType;
  notificationName: string;
  platformId: bigint;
  stash: EBlStash;
  subject: string;
  html: string;
  text?: string;
  attachments: Attachment[];
}) => {
  const platform = await db.platform.findUnique({
    where: {
      id: platformId,
    },
    include: {
      activeUsers: true,
    },
  });

  const receivers = platform?.activeUsers
    ?.filter((u) => u.email)
    ?.map((u) => ({ address: u.email!, name: u.name ?? "" }));

    const touching = touchEmailNotification({
      db,
      name: notificationName,
      stash,
    }).catch((err) =>
      getLogger().error(`Failed to touch eBlNotification: ${err}`),
    );

  const sending =
    receivers &&
    receivers.length > 0 &&
    service
      .send({
        to: receivers,
        subject,
        html,
        text,
        attachments,
      })
      .catch((err) =>
        getLogger().error(`Failed to send notification email: ${err}`),
      )


  return Promise.all([touching, sending]);
};
