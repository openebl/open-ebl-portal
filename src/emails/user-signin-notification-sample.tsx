import { imageFileToBase64DataUrl } from "./helper";
import UserSigninNotification from "./user-signin-notification";

export default function UserSigninNotificationSample() {
  return (
    <UserSigninNotification
      logoUrl={imageFileToBase64DataUrl("./public/bxwlogo.png")}
      signinUrl="https://www.example.com/signin"
    />
  );
}
