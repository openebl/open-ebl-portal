"use server";

import MainSection from "@/app/_components/settings/main-section";
import UserInfoPanel from "@/app/_components/settings/user-info-panel";
import { getServerAuthSession } from "@/server/auth";

export default async function Page() {
  const session = await getServerAuthSession();
  return <MainSection tabIndex={0}>
    <UserInfoPanel name={session?.user.name ?? ''} email={session?.user?.email ?? ''}  />
  </MainSection>;
}
