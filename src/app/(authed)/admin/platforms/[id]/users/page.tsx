"use server";

import EditPlatformUserSection from "@/app/_components/admin/platforms/edit-platform-user-section";
import PermissionContext from "@/app/_components/permission-context";
import LeftArrowIcon from "@/app/_icons/left-arrow-icon";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  const platform = await api.adminPlatform.getWithUserRoles.query(BigInt(params.id));

  if (!platform) {
    redirect("/admin/platforms");
  }

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

        <EditPlatformUserSection userRoles={platform.userRoles} platformId={platform.id} />
      </div>
    </PermissionContext>
  );
}
