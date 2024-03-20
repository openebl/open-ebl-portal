import React from "react";
import { Column, Row, Text } from "@react-email/components";
import { ActionButton } from "./components";
import { NotificationTemplate } from "./notification-template";

interface EmailProps {
  headerUrl: string;
  logoUrl: string;
  companyName: string;
  sender: string;
  eBlNo: string;
  note: string;
  viewEblLink: string;
}

export default function AccomplishNotification(props: EmailProps) {
  return (
    <NotificationTemplate
      headerUrl={props.headerUrl}
      logoUrl={props.logoUrl}
      title="eBL has been accomplished"
      preview="eBL has been accomplished"
    >
      <Row>
        <Text style={{ margin: "0", fontSize: "0.875rem" }}>
          Hi {props.companyName},
          <br />
          <br />
          {`${props.sender} has accomplished eBL No. `}
          <strong>{props.eBlNo}</strong>
          <br />
          <br />
          Note:&nbsp;
          <strong>{props.note}</strong>
          <br />
          <br />
          The eBL has been archived and can be accessed via the link below.
        </Text>
      </Row>
      <Row>
        <Column
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActionButton href={props.viewEblLink}>View eBL</ActionButton>
        </Column>
      </Row>
      <Text style={{ margin: "0", marginLeft: "auto", marginRight: "auto" }}>
        The BlueX Open eBL team
      </Text>
    </NotificationTemplate>
  );
}
