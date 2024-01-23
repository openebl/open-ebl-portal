import ConnectDotIcon from "@/app/icons/connect-dot-icon";
import { cn } from "@/lib/utils";

type HistoryItemType = {
  actor: string;
  actedBy: string;
  actedAt: string;
  action: string;
  target: string;
  targetedAt: string;
  notes: string;
  notesAltered: boolean;
};

const HistoryListHeader = () => (
  <>
    <div></div>
    <div className="self-start text-light">Actor</div>
    <div className="self-start text-light">Action</div>
    <div className="self-start text-light">Target</div>
    <div className="self-start text-light">Notes</div>
  </>
);

const HistoryListRow = ({
  item,
  first,
  last,
}: {
  item: HistoryItemType;
  first: boolean;
  last: boolean;
}) => {
  return (
    <>
      <div className="flex w-[1.125rem] flex-col items-center">
        <div
          className={cn(
            "h-[1.125rem] w-[1px]",
            !first && "border-l border-dashed border-[#004DE3]",
          )}
        ></div>
        <ConnectDotIcon className="h-[1.125rem] w-[1.125rem] text-secondary1" />
        {!last && (
          <div className="w-[1px] flex-1 border-l border-dashed border-[#004DE3]"></div>
        )}
      </div>
      <div className="border-b border-border-light py-[1.125rem]">
        <div className="">{item.actor}</div>
        <div className="text-[0.625rem] font-normal leading-4 text-main">
          by {item.actedBy}
        </div>
        <div className="text-[0.625rem] font-normal leading-4 text-main">
          {item.actedAt}
        </div>
      </div>
      <div className="border-b border-border-light py-[1.125rem]">
        {item.action}
      </div>

      <div className="border-b border-border-light py-[1.125rem]">
        <div className="">{item.target}</div>
        <div className="text-[0.625rem] font-normal leading-4 text-main">
          {item.targetedAt}
        </div>
      </div>

      <div className={cn("border-b border-border-light py-[1.125rem]", item.notesAltered && 'text-[#E42525]')}>
        {item.notes}
      </div>
    </>
  );
};

const HistoryList = ({ history }: { history: HistoryItemType[] }) => {
  return (
    <div className="border-bolder-light flex flex-col gap-[1.875rem] rounded-lg border border-solid bg-white p-[1.875rem] shadow-lg">
      <header className="header text-2xl font-semibold leading-8 text-main max-md:max-w-full">
        History
      </header>
      <div className="grid w-full grid-cols-[2.25rem_1fr_1fr_1fr_1fr] items-stretch text-xs font-semibold leading-[1.125rem]">
        <HistoryListHeader />
        {history.map((item, index) => (
          <HistoryListRow
            key={index}
            first={index === 0}
            last={index === history.length - 1}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
