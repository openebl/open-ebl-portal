import Link from "next/link";

import EmptyFolderIcon from "@/app/_icons/empty-folder-icon";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { EBlFilter, type EBlRecordListType } from "@/types/ebl";
import TableRow from "./table-row";

const FilterGroupItem = ({
  className,
  children,
  value,
}: {
  className?: string;
  children: React.ReactNode;
  value: string;
}) => {
  return (
    <Link prefetch={false} href={`/ebls?filter=${value}`}>
      <ToggleGroupItem
        value={value}
        className={cn(
          "flex w-[11.25rem] items-center justify-center gap-x-2.5 border border-gray-200 bg-white px-4 py-2 text-sm font-medium leading-[1.375rem] text-main hover:bg-gray-100 hover:text-main focus:z-20 focus:text-main focus:ring-1 focus:ring-inset focus:ring-blue-700 focus:ring-offset-0 focus-visible:z-20 focus-visible:ring-1 focus-visible:ring-blue-700 focus-visible:ring-offset-0 data-[state=on]:text-main",
          className,
        )}
      >
        {children}
      </ToggleGroupItem>
    </Link>
  );
};

const FilterList = ({
  filter,
  stats

}: {
  filter?: string | null;
  stats: { action_needed: number, upcoming: number, sent: number, archive: number };

}) => {
  const currentFilter = filter ?? "action_needed";
  return (
    <ToggleGroup
      className="inline-flex rounded-md px-4 font-header text-sm text-main"
      value={currentFilter}
      type="single"
    >
      <FilterGroupItem
        value="action_needed"
        className="rounded-none rounded-s-lg border"
      >
        Action Needed
        {stats.action_needed > 0 && (
          <span className="flex h-[18px] items-center justify-center rounded-[10px] bg-secondary1 px-2.5 py-px text-xs font-semibold text-white">
            {stats.action_needed}
          </span>
        )}
      </FilterGroupItem>
      <FilterGroupItem
        value="upcoming"
        className="rounded-none border-b border-t"
      >
        Upcoming
        {stats.upcoming > 0 && (
          <span className="flex h-[18px] items-center justify-center rounded-[10px] bg-secondary1 px-2.5 py-px text-xs font-semibold text-white">
            {stats.upcoming}
          </span>
        )}
      </FilterGroupItem>
      <FilterGroupItem value="sent" className="borde-t rounded-none border-b">
        Sent
        {stats.sent > 0 && (
          <span className="flex h-[18px] items-center justify-center rounded-[10px] bg-secondary1 px-2.5 py-px text-xs font-semibold text-white">
            {stats.sent}
          </span>
        )}
      </FilterGroupItem>
      <FilterGroupItem
        value="archive"
        className="rounded-none rounded-e-lg border"
      >
        Archive
        {stats.archive > 0 && (
          <span className="flex h-[18px] items-center justify-center rounded-[10px] bg-secondary1 px-2.5 py-px text-xs font-semibold text-white">
            {stats.archive}
          </span>
        )}
      </FilterGroupItem>
    </ToggleGroup>
  );
};

const emptyMessgaes: Record<string, string[]> = {
  action_needed: ["There are no drafts or eB/Ls pending action."] as const,
  upcoming: [
    "There are no upcoming eB/Ls.",
    "You currently have no eB/Ls assigned to you.",
  ] as const,
  sent: [
    "There are no sent eB/Ls.",
    "You have not endorsed or transferred any eB/Ls yet.",
  ] as const,
  archive: [
    "No eB/Ls in Archive.",
    "There are currently no accomplished or printed eB/Ls in your archive.",
  ] as const,
  default: ["No eB/Ls found."] as const,
};

const EmptyList = ({ filter }: { filter: EBlFilter | null | undefined }) => {
  const message =
    emptyMessgaes[filter ?? EBlFilter.ACTION_NEEDED] ?? emptyMessgaes.default;
  return (
    <div className="flex min-h-[28rem] w-full flex-col justify-center">
      <div className="text-content flex w-full flex-col items-center justify-start text-main">
        <div className="mx-auto mb-7 flex">
          <EmptyFolderIcon />
        </div>
        <div className="flex flex-col items-center justify-start gap-2.5">
          <div className="self-stretch text-center text-base font-semibold leading-normal">
            {message![0]}
          </div>
          <div className="self-stretch text-center text-xs font-normal leading-[1.125rem]">
            {message![1]}
          </div>
        </div>
      </div>
    </div>
  );
};

const EblTable = ({
  recordList,
  filter,
}: {
  recordList: EBlRecordListType;
  filter: EBlFilter | null | undefined;
}) => {
  if (recordList.total === 0) return <EmptyList filter={filter} />;

  return (
    <div className="text-content flex min-h-[28rem] w-full flex-col justify-start">
      {recordList.records.map((row, index) => (
        <TableRow key={index} row={row} filter={filter} />
      ))}
    </div>
  );
};

const EblSection = ({
  recordList,
  filter,
  stats,
}: {
  recordList: EBlRecordListType;
  filter: EBlFilter | null | undefined;
  stats: { action_needed: number, upcoming: number, sent: number, archive: number };
}) => {
  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-white shadow-xl">
      <div className="flex w-full items-center justify-start border-b-[1px] border-border-light bg-transparent py-4">
        <FilterList
          filter={filter}
          stats={stats}
        />
      </div>
      <EblTable recordList={recordList} filter={filter} />
    </div>
  );
};

export default EblSection;
