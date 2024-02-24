"use server";

import Link from "next/link";

import SearchBox from "@/app/_components/common/searchbox";
import AddIcon from "@/app/_icons/add-icon";
import { Button } from "@/components/ui/button";
import { type EBlRowType } from "@/types/ebl";
import EblSection from "./ebl-section";
import PaginatorSection from "./paginator-section";

const MainSection = ({
  result,
  page,
}: {
  result: { list: EBlRowType[]; total: number; actionRequired: number };
  page: number;
}) => {
  return (
    <div className="px-12 py-10 font-content">
      <div className="text-2xl font-bold leading-9 text-main">eB/L</div>
      <div className="flex flex-row justify-between py-[1.875rem]">
        <SearchBox />
        <Link href="/ebls/new">
          <Button className="bor h-11 w-[11.25rem] font-medium">
            <AddIcon className="mr-1" />
            New eB/L
          </Button>
        </Link>
      </div>

      <div className="flex w-full flex-col items-start justify-start gap-4">
        <EblSection list={result.list} actionRequired={result.actionRequired} />
        <PaginatorSection total={result.total} currentPage={page} />
      </div>
    </div>
  );
};

export default MainSection;
