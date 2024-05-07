"use server";

import MainSection from "@/app/_components/settings/main-section";
import UserManagementPanel from "@/app/_components/settings/user-management-panel";

export default async function Page() {
  return (
    <MainSection tabIndex={2}>
      <UserManagementPanel />
    </MainSection>
  );
}
