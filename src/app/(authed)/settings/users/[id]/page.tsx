"use server";

import UserEditSection from "@/app/_components/settings/user-edit-section";
import LeftArrowIcon from "@/app/_icons/left-arrow-icon";
import { getServerAuthSession } from "@/server/auth";
import { hasPermission } from "@/server/permissions";
import { api } from "@/trpc/server";
import { UserRoleSchema } from "@/types/user";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session) return null;
  if (!hasPermission('read:settings/users', session.permissions)) {
    redirect("/settings/user-info");
  }

  const user = await api.user.get.query(params.id);
  if (!user) {
    // TODO: handle errors
    redirect("/settings/user-info");
  }

  const userRole = user.userRoles[0]?.role ?? "viewonly";

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

      <UserEditSection
        id={String(user.id)}
        name={user.name ?? ""}
        email={user.email ?? ""}
        role={UserRoleSchema.parse(userRole)}
      />
    </div>
  );
}
