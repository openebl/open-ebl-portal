"use server";

import UserInviteSection from "@/app/_components/settings/user-invite-section";
import LeftArrowIcon from "@/app/_icons/left-arrow-icon.svg";
import { getServerAuthSession } from "@/server/auth";
import { hasPermission } from "@/server/permissions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerAuthSession();
  if (!session) return null;
  if (!hasPermission("write:settings/users", session.permissions)) {
    redirect("/settings/user-info");
  }

  return (
    <div className="px-12 py-10 font-content">
      <Link
        className="flex items-center justify-start text-xs font-semibold text-secondary1"
        href="/settings/users"
        prefetch={false}
      >
        <LeftArrowIcon className="mr-2" />
        Back
      </Link>

      <UserInviteSection />
    </div>
  );
}
