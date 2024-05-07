import AmendRequestNotification from "./amend-reqeuest-notification";
import { imageFileToBase64DataUrl } from "./helper";

export default function AmendRequestNotificationEmailSample() {
  return (
    <AmendRequestNotification
      headerUrl={imageFileToBase64DataUrl("./public/email-amend.png")}
      logoUrl={imageFileToBase64DataUrl("./public/bxwlogo.png")}
      companyName="BlueX"
      sender="DEF Forwarder"
      eBlNo="A1228475689"
      note="note note note note..."
      viewEblLink="https://www.example.com"
    />
  );
}
