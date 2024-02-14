import SearchBox from "@/app/_components/common/searchbox";
import AddIcon from "@/app/_icons/add-icon";
import { Button } from "@/components/ui/button";
import { type EBlDraftListType } from "@/types/ebl";
import Link from "next/link";
import EblSection from "./ebl-section";

const MainSection = ({ list }: { list: EBlDraftListType }) => {
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
      <EblSection list={list} />
    </div>
  );
};

export default MainSection;
