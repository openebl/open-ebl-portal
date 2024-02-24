import MainSection from "@/app/_components/ebl-list/main-section";
import { api } from "@/trpc/server";

export default async function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const pageParam = Array.isArray(searchParams?.page)
    ? searchParams?.page[0]
    : searchParams?.page;
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const result = await api.ebl.list.query({offset : (currentPage - 1) * 10, limit: 10});

  return <MainSection result={result} page={currentPage} />;
}
