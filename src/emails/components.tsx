import React from "react";
import { Button } from "@react-email/components";
import { type ReactNode } from "react";

export const ActionButton = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <Button
    href={href}
    style={{
      margin: "30px 0",
      width: "180px",
      justifyContent: "center",
      alignSelf: "center",
      borderRadius: "0.375rem",
      backgroundColor: "#F86919",
      padding: "0.75rem 3.5rem",
      textAlign: "center",
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#fff",
    }}
  >
    {children}
  </Button>
);
