import { Column, Row, Text } from "@react-email/components";

import { ActionButton } from "./components";
import { NotificationTemplate } from "./notification-template";
import { type SigninEmailProps } from "./types";

export default function UserSigninNotification(props: SigninEmailProps) {
  return (
    <NotificationTemplate
      logoUrl={props.logoUrl}
      title="Sign In"
      preview="Sign In"
    >
      <Row>
        <Text style={{ margin: "0", fontSize: "0.875rem" }}>
          Welcome back!
          <br />
          <br />
          Sign in to BlueX Open eBL below.
        </Text>
      </Row>
      <Row>
        <Column align="center" style={{ margin: "0" }}>
          <ActionButton href={props.signinUrl}>Sign In</ActionButton>
        </Column>
      </Row>
      <Text style={{ margin: "0", marginLeft: "auto", marginRight: "auto" }}>
        Please ignore this Email if you did not initiate the sign in.
        <br />
        <br />
        The BlueX Open eBL team
      </Text>
    </NotificationTemplate>
  );
}
