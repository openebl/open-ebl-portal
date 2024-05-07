import AccomplishNotification from "./accomplish-notification";
import { imageFileToBase64DataUrl } from "./helper";

export default function AccomplishNotificationEmailSample() {
  return (
    <AccomplishNotification
      headerUrl={imageFileToBase64DataUrl("./public/email-accomplished.png")}
      logoUrl={imageFileToBase64DataUrl("./public/bxwlogo.png")}
      companyName="BlueX"
      sender="DEF Forwarder"
      eBlNo="A1228475689"
      note="note note note note..."
      viewEblLink="https://www.example.com"
    />
  );
}
