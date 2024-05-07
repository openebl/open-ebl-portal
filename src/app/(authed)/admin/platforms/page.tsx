"use server";

import MainSection from "@/app/_components/admin/platforms/main-section";
import PermissionContext from "@/app/_components/permission-context";
import { getServerAuthSession } from "@/server/auth";

export default async function Page() {
  const session = await getServerAuthSession();
  return (
    <PermissionContext session={session} permission="read:admin/platforms">
      <MainSection />
    </PermissionContext>
  );
}
