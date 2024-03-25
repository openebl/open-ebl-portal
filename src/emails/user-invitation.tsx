import { Column, Row, Text } from "@react-email/components";

import { ActionButton } from "./components";
import { NotificationTemplate } from "./notification-template";
import { type InvitationEmailProps } from "./types";

export default function UserInvitation(props: InvitationEmailProps) {
  return (
    <NotificationTemplate
      logoUrl={props.logoUrl}
      title="Join BlueX Open eBL"
      preview="Join BlueX Open eBL"
    >
      <Row>
        <Text style={{ margin: "0", fontSize: "0.875rem" }}>
          Hi {props.username},
          <br />
          <br />
          {`${props.sender} has invited you to join BlueX Open eBL.`}
          <br />
          <br />
          Please click on the button below to verify your Email address.
        </Text>
      </Row>
      <Row>
        <Column align="center" style={{ margin: "0" }}>
          <ActionButton href={props.verifyUrl}>View eBL</ActionButton>
        </Column>
      </Row>
      <Text style={{ margin: "0", marginLeft: "auto", marginRight: "auto" }}>
        Please note that the verification of your Email address is required to finish the signup process.
        <br />
        <br />
        The BlueX Open eBL team
      </Text>
    </NotificationTemplate>
  );
}
