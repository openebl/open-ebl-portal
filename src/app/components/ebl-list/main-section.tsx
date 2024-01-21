import SearchBox from "@/app/components/common/searchbox";
import AddIcon from "@/app/icons/add-icon";
import { Button } from "@/components/ui/button";
import { type EBlListType } from "@/types/ebl";
import EblSection from "./ebl-section";

const MainSection = ({ list }: { list: EBlListType }) => {
  return (
    <div className="px-12 py-10 font-content">
      <div className="text-2xl font-bold leading-9 text-main">eB/L</div>
      <div className="flex flex-row justify-between py-[1.875rem]">
        <SearchBox />
        <Button className="bor h-11 w-[11.25rem] font-medium">
          <AddIcon className="mr-1" />
          New eB/L
        </Button>
      </div>
      <EblSection list={list} />
    </div>
  );
};

export default MainSection;
