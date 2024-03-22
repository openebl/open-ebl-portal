"use server";

import UserInfoEditPanel from "@/app/_components/settings/user-info-edit-panel";
import LeftArrowIcon from "@/app/_icons/left-arrow-icon";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";

export default async function Page() {
  const session = await getServerAuthSession();
  return  <div className="px-12 py-10 font-content">
  <Link
    className="flex items-center justify-start text-xs font-semibold text-secondary1"
    href="/ebls"
    prefetch={false}
  >
    <LeftArrowIcon className="mr-2" />
    Back
  </Link>

  <UserInfoEditPanel name={session?.user.name ?? ''} email={session?.user?.email ?? ''}  />

</div>


}
