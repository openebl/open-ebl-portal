import TransferNotification from "./transfer-notification";

export default function TransferNotificationEmailSample() {
  return (
    <TransferNotification
      headerUrl="/transferred.png"
      logoUrl="/bxwlogo.png"
      companyName="BlueX"
      sender="DEF Forwarder"
      eBlNo="A1228475689"
      note="note note note note..."
      viewEblLink="https://www.example.com"
    />
  );
}
