import EmptyFolderIcon from "@/app/_icons/empty-folder-icon";
import { cn } from "@/lib/utils";
import { type EBlDraftType, type EBlType } from "@/types/ebl";
import PaginatorSection from "./paginator-section";
import TableRow from "./table-row";

const FilterButton = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <button
      type="button"
      className={cn(
        "w-[11.25rem] border border-gray-200 bg-white px-4 py-2 text-sm font-medium leading-[1.375rem] text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700",
        className,
      )}
    >
      {children}
    </button>
  );
};

const FilterList = () => {
  return (
    <div
      className="inline-flex rounded-md px-4 font-header text-sm text-main shadow-sm"
      role="group"
    >
      <FilterButton className="rounded-s-lg border">Action Needed</FilterButton>
      <FilterButton className="border-b border-t">Upcoming</FilterButton>
      <FilterButton className="borde-t border-b">Sent</FilterButton>
      <FilterButton className="rounded-e-lg border">Archive</FilterButton>
    </div>
  );
};

const EmptyList = () => (
  <div className="flex min-h-[28rem] w-full flex-col justify-center">
    <div className="text-content flex w-full flex-col items-center justify-start text-main">
      <div className="mx-auto mb-7 flex">
        <EmptyFolderIcon />
      </div>
      <div className="flex flex-col items-center justify-start gap-2.5">
        <div className="self-stretch text-center text-base font-semibold leading-normal">
          There are no received eB/Ls or drafts
        </div>
        <div className="self-stretch text-center text-xs font-normal leading-[1.125rem]">
          No eB/Ls waiting for you to handle.
        </div>
      </div>
    </div>
  </div>
);

const EblTable = ({ list }: { list: EBlDraftType[] }) => {
  if (list.length === 0) return <EmptyList />;

  return (
    <div className="text-content flex min-h-[28rem] w-full flex-col justify-start">
      {list.map((row, index) => (
        <TableRow key={index} row={row} />
      ))}
    </div>
  );
};

const EblSection = ({ list }: { list: EBlDraftType[] }) => {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4">
      <div className="w-full rounded-lg border border-zinc-200 bg-white shadow-xl">
        <div className="flex w-full items-center justify-start border-b-[1px] border-border-light bg-transparent py-4">
          <FilterList />
        </div>
        <EblTable list={list} />
      </div>
      <PaginatorSection />
    </div>
  );
};

export default EblSection;
