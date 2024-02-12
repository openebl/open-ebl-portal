import {
  FourPBadge,
  HBLBadge,
  NonNegotiableBadge,
} from "@/app/_components/common/ebl-badges";
import EditIcon from "@/app/_icons/edit-icon";
import GoalFlagIcon from "@/app/_icons/goal-flag-icon";
import MailIcon from "@/app/_icons/mail-icon";
import PrinterIcon from "@/app/_icons/printer-icon";
import { cn } from "@/lib/utils";
import { type EBlDraftType, Status } from "@/types/ebl";
import Link from "next/link";

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
    <PrinterIcon />
  </Stamp>
);

const TableRow = ({ row }: { row: EBlDraftType }) => {
  const detailLink = row.status === Status.Draft ? `/ebls/${row.id}/edit` : `/ebls/${row.id}`;
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
            <div className="flex items-center justify-between gap-0.5">
              <div className="flex h-2.5 w-[70px] shrink-0 flex-col rounded-md bg-[#E0EBF6]" />
              <div className="flex h-2.5 w-[70px] shrink-0 flex-col bg-[#E0EBF6]" />
              <div className="flex h-2.5 w-[70px] shrink-0 flex-col bg-[#E0EBF6]" />
              <div className="flex h-2.5 w-[70px] shrink-0 flex-col rounded-none bg-[#E0EBF6]" />
            </div>
          </span>
          <span className="mt-[5px] flex w-full items-center justify-between gap-5">
            <div className="flex gap-2 pr-2">
              <HBLBadge />
              <NonNegotiableBadge />
              <FourPBadge title="POL: Shanghai" />
              <FourPBadge title="POD: Los Angeles" />
            </div>
            <div className="my-auto text-right text-xs leading-5">
              <span>Last updated on </span>
              <span className="font-semibold">Jan 11</span>
            </div>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TableRow;
