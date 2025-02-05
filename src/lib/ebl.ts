import type { EBlAllowAction, EBlEventType, EBlRecordType } from "@/types/ebl";
import { findLast } from "remeda";

export type EBlPartiesType = {
  issuer?: string;
  shipper?: string;
  consignee?: string;
  releaser?: string;
  endorsee?: string;
};

export type EBlStatusType =
  | "UPDATE"
  | "TRANSFER"
  | "RETURN"
  | "REQUEST_AMEND"
  | "SURRENDER"
  | "PRINT"
  | "ACCOMPLISH"
  | "UNKNOWN";

export function eBlNo(record: EBlRecordType) {
  return latestBillOfLading(record)?.transportDocumentReference;
}

export function eblIsToOrder(record: EBlRecordType): boolean {
  return latestBillOfLading(record)?.isToOrder === true;
}

export function lastEvent(record: EBlRecordType) {
  return lastNEvent(record);
}

export function lastNEvent(record: EBlRecordType, n = 0) {
  return record.bl?.events?.slice(-n - 1, n <= 0 ? undefined : -n)[0];
}

export function latestBillOfLadingEvent(record: EBlRecordType) {
  if (!record.bl?.events) return undefined;

  // find the last ISSUED event
  const event = findLast(record.bl.events, (event) => !!event.bill_of_lading?.bill_of_lading_v3);

  return event?.bill_of_lading;
}

export function latestBillOfLading(record: EBlRecordType) {
  return latestBillOfLadingEvent(record)?.bill_of_lading_v3;
}

export function currentStatus(record: EBlRecordType): EBlStatusType {
  if (!record.bl?.events) return "UNKNOWN";

  const lastEBlEvent = lastEvent(record);
  return statusFilters.find(([pred]) => pred(lastEBlEvent))?.[1] ?? "UNKNOWN";
}

// get the previous [step] status of the eBL
export function lastNStatus(record: EBlRecordType, n = 1): EBlStatusType {
  const event = lastNEvent(record, n);
  if (!event) return "UNKNOWN";

  return statusFilters.find(([pred]) => pred(event))?.[1] ?? "UNKNOWN";
}

export function eblParties(record: EBlRecordType, excludeDraft = true): EBlPartiesType | undefined {
  if (!record?.bl?.events) return undefined;

  let billOfLadingEvent: EBlEventType["bill_of_lading"] | undefined;
  if (excludeDraft) {
    // find the last ISSUED event
    billOfLadingEvent = findLast(
      record.bl.events,
      (event) => event.bill_of_lading?.bill_of_lading_v3?.transportDocumentStatus === "ISSUED",
    )?.bill_of_lading;
  } else {
    billOfLadingEvent = latestBillOfLadingEvent(record);
  }

  const parties = billOfLadingEvent?.bill_of_lading_v3?.documentParties;
  if (!parties) return {} as EBlPartiesType;

  // const key = partyFunctionToPartyCodeMap[party.partyFunction];
  // return key ? { ...acc, [key]: partyCode(party.party) } : acc;

  return {
    issuer: parties.issuingParty?.identifyingCodes?.[0]?.partyCode,
    shipper: parties.shipper?.identifyingCodes?.[0]?.partyCode,
    consignee: parties.consignee?.identifyingCodes?.[0]?.partyCode,
    endorsee: parties.endorsee?.identifyingCodes?.[0]?.partyCode,
    releaser: parties.other?.find((n) => n.partyFunction === "DDS")?.party.identifyingCodes?.[0]?.partyCode,
  };
}

export const getSenderPartyID = (record: EBlRecordType): string => {
  const lastEBlEvent = lastEvent(record);
  if (lastEBlEvent?.transfer) return lastEBlEvent?.transfer?.transfer_by ?? "";
  if (lastEBlEvent?.surrender) return lastEBlEvent?.surrender?.surrender_by ?? "";
  if (lastEBlEvent?.return) return lastEBlEvent?.return?.return_by ?? "";
  if (lastEBlEvent?.amendment_request) return lastEBlEvent?.amendment_request?.request_by ?? "";
  if (lastEBlEvent?.print_to_paper) return lastEBlEvent?.print_to_paper?.print_by ?? "";
  if (lastEBlEvent?.accomplish) return lastEBlEvent?.accomplish?.accomplish_by ?? "";
  return "";
};

export const getPreviousPartyIDByOrder = (record: EBlRecordType): string => {
  const currentOwner = record.bl?.current_owner ?? "";
  const documentParties = eblParties(record);
  if (currentOwner === documentParties?.issuer) return "";
  if (currentOwner === documentParties?.shipper) return documentParties?.issuer ?? "";
  if (currentOwner === documentParties?.consignee) return documentParties?.shipper ?? "";
  if (currentOwner === documentParties?.releaser) return documentParties?.consignee ?? "";
  return "";
};

export const getNextPartyIDByOrder = (record: EBlRecordType): string => {
  const currentOwner = record.bl?.current_owner ?? "";
  const documentParties = eblParties(record);
  if (currentOwner === documentParties?.issuer) return documentParties?.shipper ?? "";
  if (currentOwner === documentParties?.shipper) return documentParties?.consignee ?? "";
  if (currentOwner === documentParties?.consignee) return documentParties?.releaser ?? "";
  if (currentOwner === documentParties?.releaser) return "";
  return "";
};

export const getNextPartyIDByAction = (record: EBlRecordType, action: EBlAllowAction): string => {
  const documentParties = eblParties(record);
  const lastEBlEvent = lastEvent(record);
  if (action === "TRANSFER" || action === "SURRENDER") return getNextPartyIDByOrder(record);
  if (action === "REQUEST_AMEND") return documentParties?.issuer ?? "";
  if (action === "AMEND") return lastEBlEvent?.amendment_request?.request_by ?? "";
  if (action === "RETURN") {
    // to previous one
    // special case, if issuer return the amendment request (i.e. reject to amend), the eBL will return to amendment requester
    if (lastEBlEvent?.amendment_request) return lastEBlEvent?.amendment_request?.request_by ?? "";
    return getPreviousPartyIDByOrder(record);
  }
  // delete / print / accomplish action won't have next party
  return "";
};

export const getNextPartyIDByCurrentStatus = (record: EBlRecordType, status: EBlStatusType): string => {
  const lastEBlEvent = lastEvent(record);
  if (status === "REQUEST_AMEND") return lastEBlEvent?.amendment_request?.request_by ?? "";
  return getNextPartyIDByOrder(record);
};

const statusFilters: [(e?: EBlEventType) => boolean, EBlStatusType][] = [
  [(event?) => !!event?.bill_of_lading, "UPDATE"],
  [(event?) => !!event?.transfer, "TRANSFER"],
  [(event?) => !!event?.return, "RETURN"],
  [(event?) => !!event?.amendment_request, "REQUEST_AMEND"],
  [(event?) => !!event?.print_to_paper, "PRINT"],
  [(event?) => !!event?.surrender, "SURRENDER"],
  [(event?) => !!event?.accomplish, "ACCOMPLISH"],
];
