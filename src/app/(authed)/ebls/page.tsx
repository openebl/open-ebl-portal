import MainSection from "@/app/_components/ebl-list/main-section";
import { api } from "@/trpc/server";
import { type EBlFilter } from "@/types/ebl";

export default async function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const pageParam = Array.isArray(searchParams?.page)
    ? searchParams?.page[0]
    : searchParams?.page;
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const filter = Array.isArray(searchParams?.filter)
    ? searchParams?.filter[0]
    : searchParams?.filter;

  const recordList = await api.ebl.list.query({ filter, offset: (currentPage - 1) * 20, limit: 20 });

  return <MainSection recordList={recordList} page={currentPage} filter={filter as EBlFilter} />;
}
