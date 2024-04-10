import React from "react";
import { Column, Row, Text } from "@react-email/components";

import { ActionButton, NoteSection } from "./components";
import { NotificationTemplate } from "./notification-template";
import { type CommonEmailProps } from "./types";

export default function AmendedNotification(props: CommonEmailProps) {
  return (
    <NotificationTemplate
      headerUrl={props.headerUrl}
      logoUrl={props.logoUrl}
      title="eBL has been amended"
      preview="eBL has been amended"
    >
      <Row>
        <Text style={{ margin: "0", fontSize: "0.875rem" }}>
          Hi {props.companyName},
          <br />
          <br />
          {`${props.sender} has amended and issued eBL `}
          <strong>{props.eBlNo}</strong> to you.
          <br />
          <br />
          <NoteSection {...props} />
          Please review the amendment via the link below.
        </Text>
      </Row>
      <Row>
        <Column align="center" style={{ margin: "0" }}>
          <ActionButton href={props.viewEblLink}>View eBL</ActionButton>
        </Column>
      </Row>
      <Text style={{ margin: "0", marginLeft: "auto", marginRight: "auto" }}>
        The BlueX Open eBL team
      </Text>
    </NotificationTemplate>
  );
}
