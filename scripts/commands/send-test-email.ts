//
// scripts to list ebls from bu server. this is mainly for testing purposes
//

import { render } from "@react-email/render";
import { type Command } from "commander";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

import AccomplishNotification from "@/emails/accomplish-notification";
import TransferNotification from "@/emails/transfer-notification";
import { type CommonEmailProps } from "@/emails/types";

dotenv.config();
const { env } = await import("@/env.js");

export default function command(command: Command) {
  command
    .command("send-email <email>")
    .description("Send test email to the given email address.")
    .option(
      "-t, --template <template>",
      "email template. e.g. transfer, accomplish",
      validateTemplate,
      "transfer",
    )
    .action(async (email: string, options: { template: string }) => {
      console.log(`Sending ${options.template} email to ${email}`);
      await sendEmail({ email, template: options.template }).catch(
        console.error,
      );
    });
}

const validateTemplate = (template: string) => {
  const validTemplates = ["transfer", "accomplish"];
  if (!validTemplates.includes(template)) {
    throw new Error(
      `Invalid template. The available templates are ${validTemplates.join(", ")}.`,
    );
  }
  return template;
};

const sendEmail = async ({
  email,
  template,
}: {
  email: string;
  template: string;
}) => {
  const emailTemplate = emailTemplates[template];
  if (!emailTemplate) {
    throw new Error(
      `Invalid template. The available templates are ${Object.keys(emailTemplates).join(", ")}.`,
    );
  }

  const transporter = nodemailer.createTransport({
    url: env.EMAIL_SERVER,
  });

  const logoCid = "bxlogo";
  const headerCid = "header";
  const htmlString = render(
    emailTemplate.handler({
      headerUrl: `cid:${headerCid}`,
      logoUrl: `cid:${logoCid}`,
      companyName: "BlueX",
      sender: "DEF Forwarder",
      eBlNo: "A1228475689",
      note: "note note note note...",
      viewEblLink: "https://www.example.com",
    }),
  );

  console.info("sending message:");

  const info = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: `Bxebl portal testing email`, // Subject line
    html: htmlString, // html body
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

  console.info("Message sent: %s", info.messageId);
};

const emailTemplates: Record<
  string,
  { header: string; handler: (props: CommonEmailProps) => JSX.Element }
> = {
  transfer: {
    header: "./public/email-transferred.png",
    handler: TransferNotification,
  },
  accomplish: {
    header: "./public/email-accomplished.png",
    handler: AccomplishNotification,
  },
};
