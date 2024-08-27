import { imageFileToBase64DataUrl } from "./helper";
import PaymentMadeNotification from "./payment-made-notification";

export default function PaymentMadeNotificationEmailSample() {
  return (
    <PaymentMadeNotification
      logoUrl={imageFileToBase64DataUrl("./public/bxwlogo.png")}
      companyName="BlueX"
      sender="SSS Consignee"
      eBlNo="A1228475689"
      note=""
      viewEblLink="https://www.example.com"
    />
  );
}
