import { imageFileToBase64DataUrl } from "./helper";
import UserInvitation from "./user-invitation";

export default function TransferNotificationEmailSample() {
  return (
    <UserInvitation
      logoUrl={imageFileToBase64DataUrl("./public/bxwlogo.png")}
      sender="John Wick"
      username="New More"
      verifyUrl="https://www.example.com/verify-email"
    />
  );
}
