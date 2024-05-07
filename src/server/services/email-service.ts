import { createTransport } from "nodemailer";
import { type Address, type Attachment } from "nodemailer/lib/mailer";

import { env } from "@/env";
import { getLogger } from "@/lib/logger";

export type SendEmailProps = {
  to: Address | Array<string | Address>;
  subject: string;
  html: string;
  text?: string;
  attachments: Attachment[];
};

export type EmailServiceType = {
  readonly send: (props: SendEmailProps) => Promise<string>;
};


const send = async (props: SendEmailProps) => {
  getLogger().info(`Sending email to ${JSON.stringify(props.to)}`);
  const transporter = createTransport({
    url: env.EMAIL_SERVER,
  });
  const res = await transporter.sendMail({
    from: env.EMAIL_FROM,
    ...props,
  });
  return res.messageId
};

export const SmtpEmailService: EmailServiceType = { send };
