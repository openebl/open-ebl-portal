"use server";

import NewPlatformSection from "@/app/_components/admin/platforms/new-platform-section";
import PermissionContext from "@/app/_components/permission-context";
import LeftArrowIcon from "@/app/_icons/left-arrow-icon.svg";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";

export default async function Page() {
  const session = await getServerAuthSession();
  return (
    <PermissionContext session={session} permission="write:admin/platforms">
      <div className="px-12 py-10 font-content">
        <Link
          className="flex items-center justify-start text-xs font-semibold text-secondary1"
          href="/admin/platforms"
          prefetch={true}
        >
          <LeftArrowIcon className="mr-2" />
          Back
        </Link>

        <NewPlatformSection />
      </div>
    </PermissionContext>
  );
}
