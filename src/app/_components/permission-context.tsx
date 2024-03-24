"use server";

import { type Session } from "next-auth";
import { redirect } from "next/navigation";
import type React from "react";

import { hasPermission, type PermissionType } from "@/server/permissions";

type PermissionValidatorProps = {
  session: Session | null;
  permission: PermissionType;
  redirectTo?: string;
  children?: React.ReactNode;
};

const defualtRedirectTo = "/settings";

const PermissionValidator = ({ session, permission, redirectTo,children }: PermissionValidatorProps) => {
  if (!session) {
    redirect("/api/auth/signin");
  }

  if (!hasPermission(permission, session.permissions)) {
    redirect(redirectTo ?? defualtRedirectTo);
  }

  return children;
}

export default PermissionValidator;
