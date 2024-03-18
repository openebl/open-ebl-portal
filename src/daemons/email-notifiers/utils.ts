import nodemailer from "nodemailer";

import { env } from "@/env";
import { type DatabaseType, db } from "@/server/db";
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
