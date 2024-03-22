import {
  FourPBadge,
  HblNonNegotiableBadge,
} from "@/app/_components/common/ebl-badges";
import EditIcon from "@/app/_icons/edit-icon";
import GoalFlagIcon from "@/app/_icons/goal-flag-icon";
import MailIcon from "@/app/_icons/mail-icon";
import PrintedIcon from "@/app/_icons/printed-icon";
import { TimeLabel } from "@/components/ui/time-label";
import { currentStatus, getSenderPartyID, latestBillOfLadingEvent } from "@/lib/ebl";
import { cn } from "@/lib/utils";
import { EBlFilter, type EBlRecordType } from "@/types/ebl";
import { type Platforms } from "@/types/platform";
import Link from "next/link";
import React from "react";

const Stamp = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => (
  <div
    className={cn(
      "mx-5 flex h-[44px] w-[44px] items-center justify-center rounded-full",
      className,
    )}
  >
    {children}
  </div>
);

const DraftStamp = () => (
  <Stamp className="bg-[#FFF4D4] text-[#ECC600]">
    <EditIcon />
  </Stamp>
);

const InProgessStamp = () => (
  <Stamp className="bg-[#DEE8FF] text-main">
    <MailIcon />
  </Stamp>
);

const CompletedStamp = () => (
  <Stamp className="bg-[#D1F2D2] text-[#039912]">
    <GoalFlagIcon />
  </Stamp>
);

const PrintedStamp = () => (
  <Stamp className="bg-[#FFE1E1] text-[#E42525]">
    <PrintedIcon />
  </Stamp>
);

const EBlProgressBar = ({ row }: { row: EBlRecordType }) => {
  const inactive = "bg-[#E0EBF6]";
  const active = "bg-secondary1";
  return (
    <div className="flex items-center justify-between gap-0.5">
      {/* <div
        className={cn(
          "flex h-2.5 w-[70px] shrink-0 flex-col rounded-l-md",
          row.status !== Status.Draft && row.ownerPlatform === row.issuer
            ? active
            : inactive,
        )}
      />
      <div
        className={cn(
          "flex h-2.5 w-[70px] shrink-0 flex-col",
          row.status !== Status.Draft && row.ownerPlatform === row.shipper
            ? active
            : inactive,
        )}
      />
      <div
        className={cn(
          "flex h-2.5 w-[70px] shrink-0 flex-col",
          row.status !== Status.Draft && row.ownerPlatform === row.consignee
            ? active
            : inactive,
        )}
      />
      <div
        className={cn(
          "flex h-2.5 w-[70px] shrink-0 flex-col rounded-r-md",
          row.status !== Status.Draft && row.ownerPlatform === row.releaseAgent
            ? active
            : inactive,
        )}
      /> */}
    </div>
  );
};

const TableRow = ({
  row,
  filter,
  platforms,
}: {
  row: EBlRecordType;
  filter: EBlFilter | null | undefined;
  platforms: Platforms;
}) => {
  const event = latestBillOfLadingEvent(row);
  const content = event?.bill_of_lading;
  const status = currentStatus(row)
  const isEditable = row.allow_actions?.includes("UPDATE_DRAFT");
  const detailLink = isEditable ? `/ebls/${row.bl?.id}/edit` : `/ebls/${row.bl?.id}`;
  let description = ""
  if (!isEditable) {
    if (!filter || filter === EBlFilter.ACTION_NEEDED) {
      description = `From: ${platforms[getSenderPartyID(row)]?.name}`
    } else if (filter === EBlFilter.UPCOMING || filter === EBlFilter.SENT) {
      description = `Current Owner: ${platforms[row.bl?.current_owner ?? ""]?.name}`
    } else if (filter === EBlFilter.ARCHIVE) {
      description = status === "ACCOMPLISH" ? "This eBL was accomplished." : "This eBL was printed to paper."
    }
  }
  return (
    <Link href={detailLink}>
      <div className="border-b-bolder-light flex w-full items-center justify-center border-b border-solid text-main hover:bg-border-light hover:bg-opacity-20">
        {isEditable && <DraftStamp />}
        {(!isEditable && status !== "ACCOMPLISH" && status !== "PRINT") && <InProgessStamp />}
        {status === "ACCOMPLISH" && <CompletedStamp />}
        {status === "PRINT" && <PrintedStamp />}

        <div className="flex w-full flex-col items-stretch py-5 pr-8">
          <span className="flex w-full items-center justify-between gap-5">
            <div className="text-sm font-bold leading-5">
              {content?.transportDocumentReference}
            </div>

            <EBlProgressBar row={row} />
          </span>
          <span className="mt-[5px] flex w-full items-center justify-between gap-5">
            <div className="flex gap-2 pr-2">
              <HblNonNegotiableBadge />
              <FourPBadge title={`POL: ${content?.shipmentLocations?.[0]?.location.locationName}`} />
              <FourPBadge title={`POD: ${content?.shipmentLocations?.[1]?.location.locationName}`} />
              <div className="flex items-center gap-x-1 text-xs font-normal">
                {description}
              </div>
            </div>
            <div className="my-auto text-right text-xs leading-5">
              <span>Last updated on </span>
              <TimeLabel time={event?.created_at ?? ''} formatStr={'MMM d'} />
            </div>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TableRow;
