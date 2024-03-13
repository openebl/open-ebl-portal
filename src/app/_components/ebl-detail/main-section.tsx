"use server";

import { type EBlAllowAction, type EBlRecordType } from "@/types/ebl";
import FileDetails from "./file-details";
import HistoryList from "./history-list";
import ShippingProgress from "./shipping-progress";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";

const actionMapping: Record<EBlAllowAction, string> = {
  UPDATE_DRAFT: "Update eB/L draft",
  AMEND: "Amend eB/L",
  AMENDMENT_REQUEST: "Request issuer for eB/L amendment",
  PRINT_TO_PAPER: "Print eB/L",
  TRANSFER: "Transfer eB/L",
  RETURN: "Return eB/L",
  SURRENDER: "Surrender eB/L",
  ACCOMPLISH: "Accomplish eB/L",
  DELETE: "Delete eB/L",
};

const MainSection = async ({
  ebl,
}: {
  ebl: EBlRecordType;
}) => {
  const session = await getServerAuthSession();
  const platforms = await api.platform.list.query();

  const history = ebl.bl.events.map(event => {
    let action = '';
    let actor = '';
    const actorName = ''; // TODO: user name
    let actedAt = ''; // ISO 8601 date-time string, it will be converted to local time in client component later
    let target = '';
    let targetedAt = '';
    let note = '';
    let noteAltered = false;

    if (event.bill_of_lading) {
      action = 'bill_of_lading';
      actor = platforms[event.bill_of_lading.created_by]?.name ?? '';
      actedAt = event.bill_of_lading.created_at;
      target = '';
      targetedAt = '';
      note = event.bill_of_lading.note ?? '';
    } else if (event.transfer) {
      action = actionMapping.TRANSFER;
      actor = platforms[event.transfer.transfer_by]?.name ?? '';
      actedAt = event.transfer.transfer_at;
      target = platforms[event.transfer.transfer_to]?.name ?? '';
      targetedAt = '';
      note = event.transfer.note ?? '';
    } else if (event.return) {
      action = actionMapping.RETURN;
      actor = platforms[event.return.return_by]?.name ?? '';
      actedAt = event.return.return_at;
      target = platforms[event.return.return_to]?.name ?? '';
      targetedAt = '';
      note = event.return?.note ?? '';
    } else if (event.surrender) {
      action = actionMapping.SURRENDER;
      actor = platforms[event.surrender.surrender_by]?.name ?? '';
      actedAt = event.surrender.surrender_at;
      target = platforms[event.surrender.surrender_to]?.name ?? '';
      targetedAt = '';
      note = event.surrender?.note ?? '';
    } else if (event.accomplish) {
      action = actionMapping.ACCOMPLISH;
      actor = platforms[event.accomplish.accomplish_by]?.name ?? '';
      actedAt = event.accomplish.accomplish_at;
      note = event.accomplish?.note ?? '';
    } else if (event.print_to_paper) {
      action = actionMapping.PRINT_TO_PAPER;
      actor = platforms[event.print_to_paper.print_by]?.name ?? '';
      actedAt = event.print_to_paper.print_at;
      note = event.print_to_paper?.note ?? '';
    } else if (event.amendment_request) {
      action = actionMapping.AMENDMENT_REQUEST;
      actor = platforms[event.amendment_request.request_by]?.name ?? '';
      actedAt = event.amendment_request.request_at;
      note = event.amendment_request?.note ?? '';
      noteAltered = true;
    } else if (event.delete) {
      action = actionMapping.DELETE;
      actor = platforms[event.delete.delete_by]?.name ?? '';
      actedAt = event.delete.delete_at;
      note = event.delete?.note ?? '';
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
  });

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
