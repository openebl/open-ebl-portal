import { imageFileToBase64DataUrl } from "./helper";
import ReturnNotification from "./return-notification";

export default function ReturnNotificationEmailSample() {
  return (
    <ReturnNotification
      headerUrl={imageFileToBase64DataUrl("./public/email-returned.png")}
      logoUrl={imageFileToBase64DataUrl("./public/bxwlogo.png")}
      companyName="BlueX"
      sender="DEF Forwarder"
      eBlNo="A1228475689"
      note="note note note note..."
      viewEblLink="https://www.example.com"
    />
  );
}
