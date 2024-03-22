import { imageFileToBase64DataUrl } from "./helper";
import PrintNotification from "./print-notification";

export default function PrintNotificationEmailSample() {
  return (
    <PrintNotification
      headerUrl={imageFileToBase64DataUrl("./public/email-printed.png")}
      logoUrl={imageFileToBase64DataUrl("./public/bxwlogo.png")}
      companyName="BlueX"
      sender="DEF Forwarder"
      eBlNo="A1228475689"
      note="note note note note..."
      viewEblLink="https://www.example.com"
    />
  );
}
