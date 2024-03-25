"use server";

import MainSection from "@/app/_components/settings/main-section";
import UserInfoPanel from "@/app/_components/settings/user-info-panel";
import { getServerAuthSession } from "@/server/auth";

export default async function Page() {
  const session = await getServerAuthSession();
  const roles =
    session?.platformRoles
      .filter((role) => role.platform.id === session?.platform.id)
      .map((role) => role.role) ?? [];
  return (
    <MainSection tabIndex={0}>
      <UserInfoPanel
        name={session?.user.name ?? ""}
        email={session?.user?.email ?? ""}
        roles={roles}
      />
    </MainSection>
  );
}
