import { createTransport } from "nodemailer";
import { type Address, type Attachment } from "nodemailer/lib/mailer";

import { env } from "@/env";

export type SendEmailProps = {
  receivers: Address | Array<string | Address>;
  subject: string;
  content: string;
  attachments: Attachment[];
};

export type EmailServiceType = {
  readonly send: (props: SendEmailProps) => Promise<string>;
};


const send = async (props: SendEmailProps) => {
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
