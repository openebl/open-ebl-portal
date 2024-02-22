import SendIcon from "@/app/_icons/send-icon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import TransferPanel from "./transfer-panel";
import { type EBlRowType } from "@/types/ebl";
import { format } from "date-fns";
import { fromPairs } from "remeda";

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

const ProgressTrackerBar = ({ ebl }: { ebl: EBlRowType }) => {
  const active = 'bg-[#004DE3]'
  const inactive = 'bg-[#0D447A]'
  return (
    <div className="flex w-full max-w-full justify-evenly">
      <ProgressTracker
        title="Issuing Agent"
        name={ebl.issuerName ?? '--'}
        className={ebl.ownerPlatform === ebl.issuer ? active : inactive}
        position="first"
      />
      <ProgressTracker
        title="Shipper"
        name={ebl.shipperName ?? '--'}
        className={ebl.ownerPlatform === ebl.shipper ? active : inactive}
        position="middle"
      />
      <ProgressTracker
        title="Consignee"
        name={ebl.consigneeName ?? '--'}
        className={ebl.ownerPlatform === ebl.consignee ? active : inactive}
        position="middle"
      />
      <ProgressTracker
        title="Release Agent"
        name={ebl.releaseAgentName ?? '--'}
        className={ebl.ownerPlatform === ebl.releaseAgent ? active : inactive}
        position="last"
      />
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

const ProgressStatus = ({ ebl }: { ebl: EBlRowType }) => {
  const nameMapping = fromPairs([
    [ebl.issuer, ebl.issuerName],
    [ebl.shipper, ebl.shipperName],
    [ebl.consignee, ebl.consigneeName],
    [ebl.releaseAgent, ebl.releaseAgentName],
  ].filter(([id]) => !!id) as [string, string][]);

  const currentOwnerName = ebl.ownerPlatform ? nameMapping[ebl.ownerPlatform] : '-';
  const nextOwnerName = ebl.nextPlatform ? nameMapping[ebl.nextPlatform] : '-';
  return (
    <div className="flex h-[3.875rem] w-full items-start justify-start gap-[3.75rem] px-[1.875rem]">
      <ProgressStatusItem title="Last Update">
        {ebl.eta && format(ebl.eta, "MMM dd, yyyy 'at' hh:mm a")}
      </ProgressStatusItem>

      <ProgressStatusItem title="Current Owner">
        {currentOwnerName}
        {" "}
        { 1 && <span className="text-xs leading-[1.125rem] text-disabled">(You)</span> }
      </ProgressStatusItem>

      <ProgressStatusItem title="Next Owner">{nextOwnerName}</ProgressStatusItem>
    </div>
  );
};


const ShippingProgress = ({ ebl }: { ebl: EBlRowType }) => {
  return (
    <TooltipProvider>
    <section className="border-bolder-light flex w-full flex-col items-start gap-[1.875rem] rounded-lg border border-solid bg-white py-[1.875rem] shadow-lg">
      <header className="whitespace-nowrap px-[1.875rem] text-[1.375rem] font-semibold leading-8 text-main">
        Progress
      </header>

      <ProgressTrackerBar ebl={ebl} />

      <ProgressStatus ebl={ebl} />

      <div className="flex w-full px-[1.875rem]">
        <Textarea placeholder="Leave notes" className="h-[7.5rem]" />
      </div>

      <TransferPanel ebl={ebl}/>
    </section>
    </TooltipProvider>
  );
};

export default ShippingProgress;
