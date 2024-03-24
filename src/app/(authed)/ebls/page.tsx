"use server";

import MainSection from "@/app/_components/ebl-list/main-section";
import PermissionContext from "@/app/_components/permission-context";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { type EBlFilter } from "@/types/ebl";

export default async function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const session = await getServerAuthSession();
  const pageParam = Array.isArray(searchParams?.page)
    ? searchParams?.page[0]
    : searchParams?.page;
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const filter = Array.isArray(searchParams?.filter)
    ? searchParams?.filter[0]
    : searchParams?.filter;

  return (
    <PermissionContext session={session} permission="read:ebl/list">
      <MainSection
        page={currentPage}
        filter={filter as EBlFilter}
      />
      ;
    </PermissionContext>
  );
}
