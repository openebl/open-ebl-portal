import { FourPBadge, HblNegotiableBadge, HblNonNegotiableBadge } from "@/app/_components/common/ebl-badges";
import EditIcon from "@/app/_icons/edit-icon.svg";
import GoalFlagIcon from "@/app/_icons/goal-flag-icon.svg";
import MailIcon from "@/app/_icons/mail-icon.svg";
import PrintedIcon from "@/app/_icons/printed-icon.svg";
import { TimeLabel } from "@/components/ui/time-label";
import { currentStatus, eblIsToOrder, eblParties, getSenderPartyID, latestBillOfLadingEvent } from "@/lib/ebl";
import { cn } from "@/lib/utils";
import { type BusinessInfoListType } from "@/server/fx/buinfo";
import { EBlFilter, type EBlRecordType } from "@/types/ebl";
import Link from "next/link";
import React from "react";

const Stamp = ({ children, className }: { children: React.ReactNode; className: string }) => (
  <div className={cn("mx-5 flex h-[44px] w-[44px] items-center justify-center rounded-full", className)}>
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
  <Stamp className="bg-[#FFE1E1] text-warning">
    <PrintedIcon />
  </Stamp>
);

const EBlProgressBar = ({ row }: { row: EBlRecordType }) => {
  const documentParties = eblParties(row);
  const isToOrder = eblIsToOrder(row);

  const getClassName = (row: EBlRecordType, partyID: string) => {
    const inactive = "bg-[#E0EBF6]";
    const active = "bg-secondary1";
    if (row.bl?.current_owner === partyID) return active;
    return inactive;
  };

  const parties = [
    documentParties?.issuer,
    documentParties?.shipper,
    documentParties?.consignee,
    ...(isToOrder ? [documentParties?.endorsee] : []),
    documentParties?.releaser,
  ];

  const barClassNames = parties.map((party) => getClassName(row, party ?? ""));
  return (
    <div className="flex items-center justify-between gap-0.5">
      {barClassNames.map((className, i) => (
        <div
          key={i}
          className={cn(
            "flex h-2.5 w-[70px] shrink-0 flex-col",
            className,
            i === 0 && "rounded-l-md",
            i === barClassNames.length - 1 && "rounded-r-md",
          )}
        />
      ))}
    </div>
  );
};

const TableRow = ({
  row,
  filter,
  buList,
}: {
  row: EBlRecordType;
  filter: EBlFilter | null | undefined;
  buList: BusinessInfoListType | null;
}) => {
  const event = latestBillOfLadingEvent(row);
  const content = event?.bill_of_lading_v3;
  const status = currentStatus(row);
  const isEditable = row.allow_actions?.includes("UPDATE_DRAFT");
  const detailLink = isEditable ? `/ebls/${row.bl?.id}/edit` : `/ebls/${row.bl?.id}`;
  let description = <></>;
  if (!isEditable) {
    if (!filter || filter === EBlFilter.ACTION_NEEDED) {
      description = (
        <span>
          From: <span className="font-bold">{buList?.[getSenderPartyID(row)]?.legalBusinessName}</span>
        </span>
      );
    } else if (filter === EBlFilter.UPCOMING || filter === EBlFilter.SENT) {
      description = (
        <span>
          Current Owner: <span className="font-bold">{buList?.[row.bl?.current_owner ?? ""]?.legalBusinessName}</span>
        </span>
      );
    } else if (filter === EBlFilter.ARCHIVE) {
      description =
        status === "ACCOMPLISH" ? <span>This eBL was accomplished.</span> : <span>This eBL was printed to paper.</span>;
    }
  }

  // TODO: remove this after migrated to new versio
  if (!content) {
    return (
      <div className="border-b-bolder-light flex w-full items-center justify-center border-b border-solid text-main">
        <DraftStamp />
        <div className="flex w-full flex-col items-stretch py-5 pr-8">
          <span className="flex w-full items-center justify-between gap-5"></span>
          <span className="mt-[5px] flex w-full items-center justify-between gap-5">
            <div className="flex gap-2 pr-2">
              <div className="flex h-6 items-center justify-center whitespace-nowrap rounded-2xl bg-gray-600 px-2.5 text-[.625rem] font-semibold leading-4 text-white">
                Deprecated
              </div>
            </div>
            <div className="my-auto text-right text-xs leading-5"></div>
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link href={detailLink}>
      <div className="border-b-bolder-light flex w-full items-center justify-center border-b border-solid text-main hover:bg-border-light hover:bg-opacity-20">
        {isEditable && <DraftStamp />}
        {!isEditable && status !== "ACCOMPLISH" && status !== "PRINT" && <InProgessStamp />}
        {status === "ACCOMPLISH" && <CompletedStamp />}
        {status === "PRINT" && <PrintedStamp />}

        <div className="flex w-full flex-col items-stretch py-5 pr-8">
          <span className="flex w-full items-center justify-between gap-5">
            <div className="text-sm font-bold leading-5">{content?.transportDocumentReference}</div>

            <EBlProgressBar row={row} />
          </span>
          <span className="mt-[5px] flex w-full items-center justify-between gap-5">
            <div className="flex gap-2 pr-2">
              {content?.isToOrder ? <HblNegotiableBadge /> : <HblNonNegotiableBadge />}
              <FourPBadge title={`POL: ${content?.transports.portOfLoading.locationName}`} />
              <FourPBadge title={`POD: ${content?.transports.portOfDischarge.locationName}`} />
              <div className="flex items-center gap-x-1 text-xs font-normal">{description}</div>
            </div>
            <div className="my-auto text-right text-xs leading-5">
              <span>Last updated on </span>
              <TimeLabel
                time={event?.created_at ?? ""}
                formatStr={"MMM d"}
              />
            </div>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TableRow;
