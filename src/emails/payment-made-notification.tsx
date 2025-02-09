//
// This is NOT a production implementation.
// This is a demo for Panama Demo
//
import { Column, Row, Text } from "@react-email/components";

import { ActionButton } from "./components";
import { NotificationTemplate } from "./notification-template";
import { type CommonEmailProps } from "./types";

export default function PaymentMadeNotification(props: CommonEmailProps) {
  return (
    <NotificationTemplate
      headerUrl={props.headerUrl}
      logoUrl={props.logoUrl}
      title="SSS Consignee has sent a payment to you"
      preview="SSS Consignee has sent a payment to you"
    >
      <Row>
        <Text style={{ margin: "0", fontSize: "0.875rem" }}>
          Hi {props.companyName},
          <br />
          <br />
          {`You have received a payment from ${props.sender}. Please review the payment details below.`}
          <br />
          <br />
          <strong>Payment Details:</strong>
          <br />
          <ul>
            <li>
              <strong>Sender</strong>: {props.sender}
            </li>
            <li>
              <strong>Amount</strong>: $10,500.00
            </li>
            <li>
              <strong>Date</strong>: 07/29/2024
            </li>
            <li>
              <strong>EBl</strong> Number: {props.eBlNo}
            </li>
          </ul>
          <br />
          If you have any questions or need further assistance, please contact our support team at &nbsp;
          <a href="mailto:support@bluextrade.com">support@bluextrade.com</a>.
        </Text>
      </Row>
      <Row>
        <Column
          align="center"
          style={{ margin: "0" }}
        >
          <ActionButton href={props.viewEblLink}>View eBL</ActionButton>
        </Column>
      </Row>
      <Text style={{ margin: "0", marginLeft: "auto", marginRight: "auto" }}>The BlueX Open eBL team</Text>
    </NotificationTemplate>
  );
}
