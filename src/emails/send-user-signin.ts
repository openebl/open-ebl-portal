import { getLogger } from "@/lib/logger";
import { type EmailServiceType } from "@/server/services/email-service";
import { render } from "@react-email/components";
import UserSigninNotification from "./user-signin-notification";

export const sendUserSignin = async (props: {
  service: EmailServiceType;
  receiver: string;
  url: string;
}) => {
  const subject = 'Sign in to BlueX Open eBL'
  try {
    const logoCid = "bxlogo";
    const html = render(
      UserSigninNotification({
        logoUrl: `cid:${logoCid}`,
        signinUrl: props.url,
      }),
    );

    return props.service.send({
      to: [props.receiver],
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
