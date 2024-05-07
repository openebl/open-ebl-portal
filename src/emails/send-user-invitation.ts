import { getLogger } from "@/lib/logger";
import { type EmailServiceType } from "@/server/services/email-service";
import { render } from "@react-email/components";
import UserInvitation from "./user-invitation";
import { env } from "@/env";

export const sendUserInvitation = async (props: {
  service: EmailServiceType;
  receiver: { name: string | null; email: string | null};
  sender: { name?: string | null};
}) => {
  if (!props.receiver.email || !props.receiver.name || !props.sender.name) {
    getLogger().error(`Invalid invitation email data: ${JSON.stringify(props)}`);
    return;
  }

  const subject = 'You have been invited to join BlueX Open eBL!'
  try {
    const logoCid = "bxlogo";
    const verifyUrl =  new URL('/', env.PORTAL_URL).toString();
    const html = render(
      UserInvitation({
        logoUrl: `cid:${logoCid}`,
        username: props.receiver.name,
        sender: props.sender.name,
        verifyUrl,
      }),
    );

    return props.service.send({
      to: { name: props.receiver.name, address: props.receiver.email },
      subject,
      html,
      attachments: [
        {
          path: "./public/bxwlogo.png",
          contentType: "image/png",
          cid: logoCid,
        },
      ],
    });
  } catch (err) {
    getLogger().error(`Failed to send email: ${JSON.stringify(err)}`);
  }
};
