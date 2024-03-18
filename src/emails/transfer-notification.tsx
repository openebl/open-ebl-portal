import React from "react";
import { Button, Column, Row, Text } from "@react-email/components";
import { NotificationTemplate } from "./notification-template";

interface EmailProps {
  headerUrl: string,
  logoUrl: string,
  companyName: string;
  sender: string;
  eBlNo: string;
  note: string;
  viewEblLink: string;
}

export default function TransferNotification(props: EmailProps) {
  return (
    <NotificationTemplate
      headerUrl={props.headerUrl}
      logoUrl={props.logoUrl}
      title="eBL has been transferred"
      preview="eBL has been transferred"
    >
      <Row>
        <Text className="my-0 text-sm">
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
        <Column className="flex items-center justify-center">
          <Button
            href={props.viewEblLink}
            className="my-[30px] w-[180px] justify-center self-center rounded-lg bg-[#F86919] px-14 py-3 text-center text-sm font-semibold text-white"
          >
            View eBL
          </Button>
        </Column>
      </Row>
      <Text className="m-0 mx-auto">The BlueX Open eBL team</Text>
    </NotificationTemplate>
  );
}
