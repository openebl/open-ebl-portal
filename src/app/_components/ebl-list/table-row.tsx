import {
  FourPBadge,
  HblNonNegotiableBadge,
} from "@/app/_components/common/ebl-badges";
import EditIcon from "@/app/_icons/edit-icon";
import GoalFlagIcon from "@/app/_icons/goal-flag-icon";
import MailIcon from "@/app/_icons/mail-icon";
import PrintedIcon from "@/app/_icons/printed-icon";
import { portName } from "@/lib/ports";
import { cn } from "@/lib/utils";
import { Status, type EBlRowType } from "@/types/ebl";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import { findIndex } from "remeda";

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

const EBlProgressBar = ({ row }: { row: EBlRowType }) => {
  const inactive = "bg-[#E0EBF6]";
  const active = "bg-secondary1";
  return (
    <div className="flex items-center justify-between gap-0.5">
      <div
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
      />
    </div>
  );
};

const senderInfoMapping: Record<
  string,
  (row: EBlRowType) => React.JSX.Element | null
> = {
  actionNeeded: (row) => {
    const owner = findIndex(
      [row.issuer, row.shipper, row.consignee, row.releaseAgent],
      (id) => id === row.ownerPlatform,
    );
    if (owner < 1) return null;
    const senderName = [row.issuerName, row.shipperName, row.consigneeName][
      owner - 1
    ];
    return (
      <>
        From
        <span className="font-semibold">{senderName}</span>
      </>
    );
  },
  default: (row) => {
    if (!row.ownerName) return null;
    if (row.status === Status.Printed)
      return (
        <span className="text-red-500">This eB/L was printed to paper.</span>
      );
    return !row.ownerName ? null : (
      <>
        Current Owner
        <span className="font-semibold">{row.ownerName}</span>
      </>
    );
  },
};

const TableRow = ({
  row,
  filter,
}: {
  row: EBlRowType;
  filter: string | null | undefined;
}) => {
  const detailLink =
    row.status === Status.Draft ? `/ebls/${row.id}/edit` : `/ebls/${row.id}`;
  return (
    <Link href={detailLink}>
      <div className="border-b-bolder-light flex w-full items-center justify-center border-b border-solid text-main hover:bg-border-light hover:bg-opacity-20">
        {row.status === Status.Draft && <DraftStamp />}
        {row.status === Status.Processing && <InProgessStamp />}
        {row.status === Status.Completed && <CompletedStamp />}
        {row.status === Status.Printed && <PrintedStamp />}

        <div className="flex w-full flex-col items-stretch py-5 pr-8">
          <span className="flex w-full items-center justify-between gap-5">
            <div className="text-sm font-bold leading-5">
              {row.blNumber || "(Drafting)"}
            </div>

            <EBlProgressBar row={row} />
          </span>
          <span className="mt-[5px] flex w-full items-center justify-between gap-5">
            <div className="flex gap-2 pr-2">
              <HblNonNegotiableBadge />
              <FourPBadge title={`POL: ${portName(row.pol)}`} />
              <FourPBadge title={`POD: ${portName(row.pod)}`} />
              <div className="flex items-center gap-x-1 text-xs font-normal">
                { senderInfoMapping[filter ?? '']?.(row) ?? senderInfoMapping.default?.(row) }
              </div>
            </div>
            <div className="my-auto text-right text-xs leading-5">
              <span>Last updated on </span>
              <span className="font-semibold">
                {format(row.updatedAt, "MMM d")}
              </span>
            </div>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TableRow;
