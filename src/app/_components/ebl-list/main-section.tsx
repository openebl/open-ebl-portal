"use server";

import Link from "next/link";

import SearchBox from "@/app/_components/common/searchbox";
import AddIcon from "@/app/_icons/add-icon";
import { Button } from "@/components/ui/button";
import type { EBlFilter, EBlRecordListType } from "@/types/ebl";
import EblSection from "./ebl-section";
import PaginatorSection from "./paginator-section";

const MainSection = ({
  recordList,
  page,
  filter,
}: {
  recordList: EBlRecordListType;
  page: number;
  filter: EBlFilter | null | undefined;
}) => {
  return (
    <div className="px-12 py-10 font-content">
      <div className="text-2xl font-bold leading-9 text-main">eBL</div>
      <div className="flex flex-row justify-between py-[1.875rem]">
        <SearchBox />
        <Link href="/ebls/new">
          <Button className="bor h-11 w-[11.25rem] font-medium">
            <AddIcon className="mr-1" />
            New eBL
          </Button>
        </Link>
      </div>

      <div className="flex w-full flex-col items-start justify-start gap-4">
        <EblSection
          filter={filter}
          recordList={recordList}
          stats={{ action_needed: 1, upcoming: 1, sent: 1, archive: 1 }} // TODO
        />
        <PaginatorSection
          total={recordList.total}
          currentPage={page}
          filter={filter}
        />
      </div>
    </div>
  );
};

export default MainSection;
