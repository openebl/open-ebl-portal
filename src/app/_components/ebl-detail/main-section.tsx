"use server";

import { type EBlAllowAction, type EBlRecordType } from "@/types/ebl";
import FileDetails from "./file-details";
import HistoryList from "./history-list";
import ShippingProgress from "./shipping-progress";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";

const actionMapping: Record<EBlAllowAction, string> = {
  UPDATE_DRAFT: "Updated draft",
  AMEND: "Amended and Transferred",
  REQUEST_AMEND: "Requested amendment",
  PRINT: "Printed to paper",
  TRANSFER: "Transferred document",
  RETURN: "Returned document",
  SURRENDER: "Surrendered document",
  ACCOMPLISH: "Accomplished document",
  DELETE: "Deleted document",
};

const MainSection = async ({
  ebl,
}: {
  ebl: EBlRecordType;
}) => {
  const session = await getServerAuthSession();
  const platforms = await api.platform.list.query();

  const history = ebl.bl?.events?.map((event, index) => {
    let action = '';
    let actor = '';
    let actorName = '';
    let actedAt = ''; // ISO 8601 date-time string, it will be converted to local time in client component later
    let target = '';
    let targetedAt = '';
    let note = '';
    let noteAltered = false;

    if (event.bill_of_lading) {
      action = index === 0 ? 'Issued document' : 'Amended document';
      actor = platforms[event.bill_of_lading.created_by ?? ""]?.name ?? '';
      actorName = event.bill_of_lading.metadata?.username ?? '';
      actedAt = event.bill_of_lading.created_at ?? "";
      target = '';
      note = event.bill_of_lading.note ?? '';
    } else if (event.transfer) {
      action = actionMapping.TRANSFER;
      actor = platforms[event.transfer.transfer_by ?? ""]?.name ?? '';
      actorName = event.transfer.metadata?.username ?? '';
      actedAt = event.transfer.transfer_at ?? "";
      target = platforms[event.transfer.transfer_to ?? ""]?.name ?? '';
      targetedAt = actedAt;
      note = event.transfer.note ?? '';
    } else if (event.return) {
      action = actionMapping.RETURN;
      actor = platforms[event.return.return_by ?? ""]?.name ?? '';
      actorName = event.return.metadata?.username ?? '';
      actedAt = event.return.return_at ?? "";
      target = platforms[event.return.return_to ?? ""]?.name ?? '';
      targetedAt = actedAt;
      note = event.return?.note ?? '';
    } else if (event.surrender) {
      action = actionMapping.SURRENDER;
      actor = platforms[event.surrender.surrender_by ?? ""]?.name ?? '';
      actorName = event.surrender.metadata?.username ?? '';
      actedAt = event.surrender.surrender_at ?? "";
      target = platforms[event.surrender.surrender_to ?? ""]?.name ?? '';
      targetedAt = actedAt;
      note = event.surrender?.note ?? '';
    } else if (event.accomplish) {
      action = actionMapping.ACCOMPLISH;
      actor = platforms[event.accomplish.accomplish_by ?? ""]?.name ?? '';
      actorName = event.accomplish.metadata?.username ?? '';
      actedAt = event.accomplish.accomplish_at ?? "";
      note = event.accomplish?.note ?? '';
    } else if (event.print_to_paper) {
      action = actionMapping.PRINT;
      actor = platforms[event.print_to_paper.print_by ?? ""]?.name ?? '';
      actorName = event.print_to_paper.metadata?.username ?? '';
      actedAt = event.print_to_paper.print_at ?? "";
      note = event.print_to_paper?.note ?? '';
    } else if (event.amendment_request) {
      action = actionMapping.REQUEST_AMEND;
      actor = platforms[event.amendment_request.request_by ?? ""]?.name ?? '';
      actorName = event.amendment_request.metadata?.username ?? '';
      actedAt = event.amendment_request.request_at ?? "";
      target = platforms[event.amendment_request.request_to ?? ""]?.name ?? '';
      targetedAt = actedAt;
      note = event.amendment_request?.note ?? '';
      noteAltered = true;
    }

    return {
      actor,
      actorName,
      actedAt,
      action,
      target,
      targetedAt,
      note,
      noteAltered,
    };
  }) ?? [];

  return (
    <div className="mt-[1.875rem] flex flex-col gap-y-5">
      <FileDetails ebl={ebl} />
      <ShippingProgress
        ebl={ebl}
        sessionPlatformId={String(session?.platform.platformId)}
      />
      <HistoryList history={history} />
    </div>
  );
};

export default MainSection;
