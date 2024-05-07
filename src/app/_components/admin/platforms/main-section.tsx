"use server";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import PlatformList from "./platform-list";
import PermissionedSection from "@/app/_components/common/permissioned-section";

const MainSection = async () => {
  const platforms = await api.adminPlatform.list.query();
  const session = await getServerAuthSession();

  return (
    <div className="mx-[3.125rem] my-[1.875rem] flex flex-col rounded-lg border border-solid border-border-light bg-white text-sm leading-4 text-main shadow-lg">
      <div className="flex w-full items-center justify-between px-[1.875rem] py-[1.125rem] text-lg font-semibold leading-[1.625rem]">
        <div>Platforms</div>
        <PermissionedSection
          permissions={session?.permissions}
          required="write:admin/platforms"
        >
          <Link href="/admin/platforms/new">
            <Button size="lg" className="w-[7.5rem]">
              New
            </Button>
          </Link>
        </PermissionedSection>
      </div>
      <PlatformList platforms={platforms} />
    </div>
  );
};

export default MainSection;
