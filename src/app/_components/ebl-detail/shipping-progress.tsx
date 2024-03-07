import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type EBlRecordDetailType } from "@/types/ebl";
import ActionPanel from "./action-panel";

type TrackerPosition = "first" | "middle" | "last";

const TrackerPositionClipPath = {
  first:
    "polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%)",
  middle:
    "polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%, 12px 50%)",
  last: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 12px 50%)",
};

const ProgressTracker = ({
  title,
  name,
  className,
  position,
}: {
  title: string;
  name: string;
  className: string;
  position: TrackerPosition;
}) => {
  position;
  return (
    <Tooltip>
      <div
        className={cn(
          "flex min-w-0 max-w-[26%] flex-auto flex-col items-start justify-center bg-[#004DE3] py-[1.0625rem] pl-[1.875rem] pr-8",
          className,
          position === "first" ? "pl-[1.875rem]" : "-ml-[10px] pl-9",
        )}
        style={{
          clipPath: TrackerPositionClipPath[position],
        }}
      >
        <div className="whitespace-nowrap text-xs font-semibold leading-[1.125rem] text-[#86A1BC]">
          {title}
        </div>
        <TooltipTrigger asChild>
          <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold leading-7 text-white">
            {name}
          </div>
        </TooltipTrigger>
      </div>
      <TooltipContent>
        <p>{name}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const ProgressTrackerBar = ({ ebl }: { ebl: EBlRecordDetailType }) => {
  const active = "bg-[#004DE3]";
  const inactive = "bg-[#0D447A]";
  return (
    <div className="flex w-full max-w-full justify-evenly">
      {/* <ProgressTracker
        title="Issuing Agent"
        name={ebl.issuerName ?? "--"}
        className={ebl.ownerPlatform === ebl.issuer ? active : inactive}
        position="first"
      />
      <ProgressTracker
        title="Shipper"
        name={ebl.shipperName ?? "--"}
        className={ebl.ownerPlatform === ebl.shipper ? active : inactive}
        position="middle"
      />
      <ProgressTracker
        title="Consignee"
        name={ebl.consigneeName ?? "--"}
        className={ebl.ownerPlatform === ebl.consignee ? active : inactive}
        position="middle"
      />
      <ProgressTracker
        title="Release Agent"
        name={ebl.releaseAgentName ?? "--"}
        className={ebl.ownerPlatform === ebl.releaseAgent ? active : inactive}
        position="last"
      /> */}
    </div>
  );
};

const ProgressStatusItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col items-start justify-start">
    <div className="whitespace-nowrap text-xs font-normal leading-[1.125rem] text-light">
      {title}
    </div>
    <div className="whitespace-nowrap text-base font-semibold text-main">
      {children}
    </div>
  </div>
);

const ProgressStatus = ({
  ebl,
  sessionPlatformId,
}: {
  ebl: EBlRecordDetailType;
  sessionPlatformId: string | undefined;
}) => {
  const currentOwnerName = 'TODO: currentOwnerName' // TODO
  const nextOwnerName = 'TODO: nextOwnerName' // TODO
  return (
    <div className="flex h-[3.875rem] w-full items-start justify-start gap-[3.75rem] px-[1.875rem]">
      {/* <ProgressStatusItem title="Current Owner">
        {currentOwnerName}
        {sessionPlatformId === ebl.ownerPlatform && (
          <span className="text-xs leading-[1.125rem] text-disabled">
            {" "}
            (You)
          </span>
        )}
      </ProgressStatusItem>

      <ProgressStatusItem title="Next Owner">
        {nextOwnerName}
        {sessionPlatformId === ebl.nextPlatform && (
          <span className="text-xs leading-[1.125rem] text-disabled">
            {" "}
            (You)
          </span>
        )}
      </ProgressStatusItem> */}
    </div>
  );
};

const ShippingProgress = ({
  ebl,
  sessionPlatformId,
}: {
  ebl: EBlRecordDetailType;
  sessionPlatformId: string | undefined;
}) => {
  return (
    <TooltipProvider>
      <section className="border-bolder-light flex w-full flex-col items-start gap-[1.875rem] rounded-lg border border-solid bg-white py-[1.875rem] shadow-lg">
        <header className="whitespace-nowrap px-[1.875rem] text-[1.375rem] font-semibold leading-8 text-main">
          Progress
        </header>

        <ProgressTrackerBar ebl={ebl} />

        <ProgressStatus ebl={ebl} sessionPlatformId={sessionPlatformId} />

        <ActionPanel ebl={ebl} />
      </section>
    </TooltipProvider>
  );
};

export default ShippingProgress;
