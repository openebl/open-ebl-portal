import {
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import React from "react";

interface TempalteProps {
  headerUrl?: string;
  logoUrl: string;
  preview: string;
  title: string;
  children: React.ReactNode;
}

export function NotificationTemplate({
  headerUrl,
  logoUrl,
  preview,
  title,
  children,
}: TempalteProps) {
  return (
    <Html>
      <Preview>{preview}</Preview>
      <Head key="head">
        <Font
          fontFamily="Arial"
          fallbackFontFamily="Verdana"
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Section
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#0A35A2",
          padding: '25px 50px',
        }}
      >
        <Row style={{ margin: "0" }}>
          <Column width="82px">
            <Img width="82" height="20" alt="BlueX" src={logoUrl} />
          </Column>
          <Column>
            <Text
              style={{
                marginLeft: "1.25rem",
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#fff",
                margin: "0",
              }}
            >
              Open eBL
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{ width: "100%", maxWidth: "600px", padding: "0", marginTop: '40px', marginBottom: '20px' }}>
        {headerUrl && <Img alt="" src={headerUrl} style={{ margin: "0 auto"}} />}
      </Section>

      <Container
        style={{
          marginTop: 0,
          marginBottom: 0,
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#fff",
          color: "#18335E",
        }}
      >
        {/* Main Content */}
        <Container
          style={{ width: "100%", maxWidth: "600px", padding: "30px" }}
        >
          <Text
            style={{
              width: "100%",
              maxWidth: "540px",
              textAlign: "center",
              fontSize: "22px",
              fontWeight: "700",
              lineHeight: "2rem",
              margin: "0",
              marginBottom: "30px",
            }}
          >
            {title}
          </Text>
          {children}
        </Container>

        {/* Footer */}
        <Section
          style={{
            width: "100%",
            maxWidth: "600px",
            backgroundColor: "#1F2A3B",
            padding: "30px",
            paddingTop: "1.25rem",
            paddingBottom: "1.25rem",
            color: "#fff",
          }}
        >
          <Row>
            <Column>
              <Text
                style={{ margin: "0", fontSize: "0.875rem", fontWeight: "600" }}
              >
                BlueX Open eBL
              </Text>
              <Text
                style={{
                  margin: "0",
                  fontSize: "10px",
                  fontWeight: "400",
                  lineHeight: "1rem",
                  color: "#999",
                }}
              >
                bxebl-portal.bluex.trade
              </Text>
              <Text
                style={{
                  marginTop: "1.25rem",
                  marginBottom: "1.25rem",
                  fontSize: "10px",
                  fontWeight: "600",
                  lineHeight: "1rem",
                }}
              >
                BlueX Trade
                <br />
                20955 Pathfinder Rd
                <br />
                Diamond Bar, CA 91765-4028
                <br />
                USA
              </Text>
              <Text
                style={{
                  margin: "0",
                  fontSize: "10px",
                  fontWeight: "600",
                  lineHeight: "1rem",
                }}
              >
                Copyright (C) 2024 BlueX Trade. All rights reserved.
              </Text>
            </Column>
            <Column>{/* TODO: Add social media links */}</Column>
          </Row>
        </Section>
      </Container>
    </Html>
  );
}
