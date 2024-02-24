"use server";

import { format } from "date-fns";

import type { EBlJourneyRowListType, EBlRowType } from "@/types/ebl";
import FileDetails from "./file-details";
import HistoryList from "./history-list";
import ShippingProgress from "./shipping-progress";
import { getServerAuthSession } from "@/server/auth";

const actionMapping = {
  DRAFT: "Uploaded eB/L to the system.",
  ISSUE: "Transfer of document",
  GRANT_SHIPPER: null,
  GRANT_CONSIGNEE: null,
  GRANT_RELEASE_AGENT: null,
  TRANSFER: "Transfer of document",
  AMEND: "Reqeuest of amendment",
  SURRENDER: "Reqeuest of surrender",
  COMPLETE: "Accomplish",
  PRINT: "Print eB/L",
};

const MainSection = async ({
  ebl,
  journey,
}: {
  ebl: EBlRowType;
  journey: EBlJourneyRowListType;
}) => {
  const session = await getServerAuthSession();
  const targetMapping = [
    [ebl.issuer, ebl.issuerName],
    [ebl.shipper, ebl.shipperName],
    [ebl.consignee, ebl.consigneeName],
    [ebl.releaseAgent, ebl.releaseAgentName],
  ]
    .filter(([id]) => id)
    .reduce(
      (acc, [id, name]) => ({ ...acc, [id!]: name! }),
      {} as Record<string, string>,
    );

  const history = journey
    .filter((j) => actionMapping[j.action])
    .map((j) => ({
      actor: targetMapping[j.sourcePlatform ?? ""] ?? "",
      actedBy: j.user?.name ?? "",
      actedAt: format(j.createdAt, "MMM dd, yyyy 'at' hh:mm a"),
      action: actionMapping[j.action] ?? "",
      target: (j.targetPlatform && targetMapping[j.targetPlatform]) ?? "",
      targetedAt: format(j.createdAt, "MMM dd, yyyy 'at' hh:mm a"),
      notes: j.note ?? "",
      notesAltered: j.action === "AMEND",
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
