"use server";

import type { EBlRecordType, EBlAllowAction } from "@/types/ebl";
import type { ImageType } from "@/app/_components/common/props/types";
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

const getBuLegalBusinessName = async (buId: string | undefined | null) => {
  if (!buId) return "";

  return api.buinfo.legalBusinessName.query(buId);
};

const MainSection = async ({
  ebl,
  images,
}: {
  ebl: EBlRecordType;
  images: ImageType[];
}) => {
  const session = await getServerAuthSession();
  const history = await Promise.all(
    ebl.bl?.events?.map(async (event, index) => {
      let action = "";
      let actor = "";
      let actorName = "";
      let actedAt = ""; // ISO 8601 date-time string, it will be converted to local time in client component later
      let target = "";
      let targetedAt = "";
      let note = "";
      let noteAltered = false;

      if (event.bill_of_lading) {
        action = index === 0 ? "Issued document" : "Amended document";
        actor = await getBuLegalBusinessName(event.bill_of_lading.created_by);
        actorName = event.bill_of_lading.metadata?.username ?? "";
        actedAt = event.bill_of_lading.created_at ?? "";
        target = "";
        note = event.bill_of_lading.note ?? "";
      } else if (event.transfer) {
        action = actionMapping.TRANSFER;
        actor = await getBuLegalBusinessName(event.transfer.transfer_by);
        actorName = event.transfer.metadata?.username ?? "";
        actedAt = event.transfer.transfer_at ?? "";
        target = await getBuLegalBusinessName(event.transfer.transfer_to);
        targetedAt = actedAt;
        note = event.transfer.note ?? "";
      } else if (event.return) {
        action = actionMapping.RETURN;
        actor = await getBuLegalBusinessName(event.return.return_by);
        actorName = event.return.metadata?.username ?? "";
        actedAt = event.return.return_at ?? "";
        target = await getBuLegalBusinessName(event.return.return_to);
        targetedAt = actedAt;
        note = event.return?.note ?? "";
      } else if (event.surrender) {
        action = actionMapping.SURRENDER;
        actor = await getBuLegalBusinessName(event.surrender.surrender_by);
        actorName = event.surrender.metadata?.username ?? "";
        actedAt = event.surrender.surrender_at ?? "";
        target = await getBuLegalBusinessName(event.surrender.surrender_to);
        targetedAt = actedAt;
        note = event.surrender?.note ?? "";
      } else if (event.accomplish) {
        action = actionMapping.ACCOMPLISH;
        actor = await getBuLegalBusinessName(event.accomplish.accomplish_by);
        actorName = event.accomplish.metadata?.username ?? "";
        actedAt = event.accomplish.accomplish_at ?? "";
        note = event.accomplish?.note ?? "";
      } else if (event.print_to_paper) {
        action = actionMapping.PRINT;
        actor = await getBuLegalBusinessName(event.print_to_paper.print_by);
        actorName = event.print_to_paper.metadata?.username ?? "";
        actedAt = event.print_to_paper.print_at ?? "";
        note = event.print_to_paper?.note ?? "";
      } else if (event.amendment_request) {
        action = actionMapping.REQUEST_AMEND;
        actor = await getBuLegalBusinessName(
          event.amendment_request.request_by,
        );
        actorName = event.amendment_request.metadata?.username ?? "";
        actedAt = event.amendment_request.request_at ?? "";
        target = await getBuLegalBusinessName(
          event.amendment_request.request_to,
        );
        targetedAt = actedAt;
        note = event.amendment_request?.note ?? "";
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
    }) ?? []);

  return (
    <div className="mt-[1.875rem] flex flex-col gap-y-5">
      <FileDetails ebl={ebl} images={images} />
      <ShippingProgress
        ebl={ebl}
        businessUnitId={String(session?.businessUnitId)}
      />
      <HistoryList history={history} />
    </div>
  );
};

export default MainSection;
