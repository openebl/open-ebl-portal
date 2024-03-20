import { imageFileToBase64DataUrl } from "./helper";
import TransferNotification from "./transfer-notification";

export default function TransferNotificationEmailSample() {
  return (
    <TransferNotification
      headerUrl={imageFileToBase64DataUrl("./public/email-transferred.png")}
      logoUrl={imageFileToBase64DataUrl("./public/bxwlogo.png")}
      companyName="BlueX"
      sender="DEF Forwarder"
      eBlNo="A1228475689"
      note="note note note note..."
      viewEblLink="https://www.example.com"
    />
  );
}
