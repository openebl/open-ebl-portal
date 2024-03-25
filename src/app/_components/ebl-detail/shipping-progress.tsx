import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type EBlRecordType } from "@/types/ebl";
import ActionPanel from "./action-panel";
import { api } from "@/trpc/server";
import { type EBlStatusType, currentStatus, eblParties, getNextPartyIDByCurrentStatus } from "@/lib/ebl";
import CircleInCheckIcon from "@/app/_icons/check-in-circle-icon";

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
          "flex min-w-0 max-w-[26%] flex-auto flex-col items-start justify-center bg-secondary1 py-[1.0625rem] pl-[1.875rem] pr-8",
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

const ProgressTrackerBar = async ({ ebl }: { ebl: EBlRecordType }) => {
  const active = "bg-secondary1";
  const inactive = "bg-[#0D447A]";
  const accomplished = "bg-[#039912]";
  const printed = "bg-warning";

  // TODO: try not to await in RSC
  const platforms = await api.platform.list.query();
  const documentParties = eblParties(ebl)
  const issuerID = documentParties?.issuer ?? ""
  const shipperID = documentParties?.shipper ?? ""
  const consigneeID = documentParties?.consignee ?? ""
  const releaseAgentID = documentParties?.releaser ?? ""
  const issuerName = platforms[issuerID]?.name ?? ""
  const shipperName = platforms[shipperID]?.name ?? ""
  const consigneeName = platforms[consigneeID]?.name ?? ""
  const releaseAgentName = platforms[releaseAgentID]?.name ?? ""

  const getClassName = (ebl: EBlRecordType, partyID: string) => {
    const status = currentStatus(ebl)
    if (status === "PRINT" && ebl.bl?.current_owner === partyID) return printed;
    if (status === "ACCOMPLISH" && ebl.bl?.current_owner === partyID) return accomplished;
    if (ebl.bl?.current_owner === partyID) return active;
    return inactive;
  }

  return (
    <div className="flex w-full max-w-full justify-evenly">
      <ProgressTracker
        title="Issuing Agent"
        name={issuerName}
        className={getClassName(ebl, issuerID)}
        position="first"
      />
      <ProgressTracker
        title="Shipper"
        name={shipperName}
        className={getClassName(ebl, shipperID)}
        position="middle"
      />
      <ProgressTracker
        title="Consignee"
        name={consigneeName}
        className={getClassName(ebl, consigneeID)}
        position="middle"
      />
      <ProgressTracker
        title="Release Agent"
        name={releaseAgentName}
        className={getClassName(ebl, releaseAgentID)}
        position="last"
      />
    </div>
  );
}

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

const ProgressStatusText = ({
  status
}: {
  status: EBlStatusType
}) => (
  <ProgressStatusItem title="Status">
    {status === "PRINT" && <p className="text-warning">Printed to Paper</p>}
    {status === "SURRENDER" &&
      <div className="flex gap-x-1 items-center">
        Not accomplished yet {<CircleInCheckIcon className="text-hint" />}
      </div>
    }
    {status === "ACCOMPLISH" &&
      <div className="flex gap-x-1 items-center">
        Accomplished {<CircleInCheckIcon className="text-[#42BE25]" />}
      </div>
    }
  </ProgressStatusItem>
);

const ProgressStatus = async ({
  ebl,
  sessionPlatformId,
}: {
  ebl: EBlRecordType;
  sessionPlatformId: string | undefined;
}) => {
  // TODO: try not to await in RSC
  const platforms = await api.platform.list.query();
  const status = currentStatus(ebl)
  const nextPartyID = getNextPartyIDByCurrentStatus(ebl, status);
  const currentOwnerName = platforms[ebl.bl?.current_owner ?? ""]?.name ?? ""
  const nextOwnerName = platforms[nextPartyID]?.name

  const showNextOwner = !["SURRENDER", "ACCOMPLISH", "PRINT"].includes(status);
  const showStatus = !showNextOwner

  return (
    <div className="flex h-[3.875rem] w-full items-start justify-start gap-[3.75rem] px-[1.875rem]">
      <ProgressStatusItem title="Current Owner">
        {currentOwnerName}
        {sessionPlatformId === ebl.bl?.current_owner && (
          <span className="text-xs leading-[1.125rem] text-disabled">
            {" "}
            (You)
          </span>
        )}
      </ProgressStatusItem>

      {showNextOwner &&
        <ProgressStatusItem title="Next Owner">
          {nextOwnerName}
          {sessionPlatformId === nextPartyID && (
            <span className="text-xs leading-[1.125rem] text-disabled">
              {" "}
              (You)
            </span>
          )}
        </ProgressStatusItem>
      }

      {showStatus &&
        <ProgressStatusText status={status} />
      }
    </div>
  );
};

const ShippingProgress = ({
  ebl,
  sessionPlatformId,
}: {
  ebl: EBlRecordType;
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
