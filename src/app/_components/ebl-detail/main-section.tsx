"use server";

import { format } from "date-fns";

import { EBlAllowAction, type EBlJourneyRowListType, type EBlRecordDetailType } from "@/types/ebl";
import FileDetails from "./file-details";
import HistoryList from "./history-list";
import ShippingProgress from "./shipping-progress";
import { getServerAuthSession } from "@/server/auth";

const actionMapping = {
  UPDATE: "Update eB/L draft",
  AMEND: "Amend eB/L",
  AMENDMENT_REQUEST: "Request issuer for eB/L amendment",
  PRINT_TO_PAPER: "Print eB/L",
  TRANSFER: "Transfer eB/L",
  RETURN: "Return eB/L",
  SURRENDER: "Surrender eB/L",
  ACCOMPLISH: "Accomplish eB/L",
};

const MainSection = async ({
  ebl,
  journey,
}: {
  ebl: EBlRecordDetailType;
  journey: EBlJourneyRowListType;
}) => {
  const session = await getServerAuthSession();

  const history = journey
    .filter((j) => actionMapping[j.action])
    .map((j) => ({
      actor: "TODO: actor", // TODO
      actedBy: j.user?.name ?? "",
      actedAt: format(j.createdAt, "MMM dd, yyyy 'at' hh:mm a"),
      action: actionMapping[j.action] ?? "",
      target: "TODO: target", // TODO
      targetedAt: format(j.createdAt, "MMM dd, yyyy 'at' hh:mm a"),
      notes: j.note ?? "",
      notesAltered: j.action === EBlAllowAction.AmendmentRequest,
    }));

  return (
    <div className="mt-[1.875rem] flex flex-col gap-y-5">
      <FileDetails ebl={ebl} />
      <ShippingProgress
        ebl={ebl}
        sessionPlatformId={session?.platformId.toString()}
      />
      <HistoryList history={history} />
    </div>
  );
};

export default MainSection;
