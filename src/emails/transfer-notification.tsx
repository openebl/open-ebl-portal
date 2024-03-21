import React from "react";
import { Column, Row, Text } from "@react-email/components";

import { NotificationTemplate } from "./notification-template";
import { ActionButton } from "./components";
import { type CommonEmailProps } from "./types";

export default function TransferNotification(props: CommonEmailProps) {
  return (
    <NotificationTemplate
      headerUrl={props.headerUrl}
      logoUrl={props.logoUrl}
      title="eBL has been transferred"
      preview="eBL has been transferred"
    >
      <Row>
        <Text style={{ margin: "0", fontSize: "0.875rem" }}>
          Hi {props.companyName},
          <br />
          <br />
          {`${props.sender} has transferred eBL `}
          <strong>{props.eBlNo}</strong>
          {` to your company.`}
          <br />
          <br />
          Note:&nbsp;
          <strong>{props.note}</strong>
          <br />
          <br />
          Please review the eBL via the link below.
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
