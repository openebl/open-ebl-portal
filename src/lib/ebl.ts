import { type external } from "@/types/bu-scheme";
import type { EBlAllowAction, EBlRecordType, EBlEventType } from "@/types/ebl";
import { findLast, last } from "remeda";

type PartyType =
  external["https://api.swaggerhub.com/domains/dcsaorg/DOCUMENTATION_DOMAIN/2.1.0"]["components"]["schemas"]["party"];

export type EBlPartiesType = {
  issuer?: string;
  shipper?: string;
  consignee?: string;
  releaser?: string;
};

export type EBlStatusType =
  | "TRANSFER"
  | "RETURN"
  | "REQUEST_AMEND"
  | "SURRENDER"
  | "PRINT"
  | "ACCOMPLISH"
  | "UNKNOWN";

export function eBlNo(record: EBlRecordType) {
  return latestBillOfLading(record)?.transportDocumentReference
}

export function lastEvent(record: EBlRecordType) {
  if (!record.bl?.events) return undefined;
  return last(record.bl?.events);
}

export function latestBillOfLadingEvent(record: EBlRecordType) {
  if (!record.bl?.events) return undefined;

  // find the last ISSUED event
  const event = findLast(
    record.bl.events,
    (event) => !!event.bill_of_lading?.bill_of_lading?.shippingInstruction,
  );

  return event?.bill_of_lading;
}

export function latestBillOfLading(record: EBlRecordType) {
  return latestBillOfLadingEvent(record)?.bill_of_lading;
}

export function currentStatus(record: EBlRecordType): EBlStatusType {
  if (!record.bl?.events) return "UNKNOWN";

  const lastEBlEvent = lastEvent(record);
  return statusFilters.find(([pred]) => pred(lastEBlEvent))?.[1] ?? "UNKNOWN";
}

export function eblParties(
  record: EBlRecordType,
  excludeDraft = true
): EBlPartiesType | undefined {
  if (!record?.bl?.events) return undefined;

  let billOfLadingEvent: EBlEventType["bill_of_lading"] | undefined;
  if (excludeDraft) {
    // find the last ISSUED event
    billOfLadingEvent = findLast(
      record.bl.events,
      (event) =>
        event.bill_of_lading?.bill_of_lading?.shippingInstruction
          ?.documentStatus === "ISSU",
    )?.bill_of_lading;
  } else {
    billOfLadingEvent = latestBillOfLadingEvent(record)
  }

  return billOfLadingEvent?.bill_of_lading?.shippingInstruction?.documentParties?.reduce(
    (acc, party) => {
      if (!party.partyFunction) return acc;

      const key = partyFunctionToPartyCodeMap[party.partyFunction];
      return key ? { ...acc, [key]: partyCode(party.party) } : acc;
    },
    {} as EBlPartiesType,
  );
}

export const getPreviousPartyID = (record: EBlRecordType): string => {
  const lastEBlEvent = lastEvent(record);
  if (lastEBlEvent?.transfer) return lastEBlEvent?.transfer?.transfer_by ?? "";
  if (lastEBlEvent?.surrender) return lastEBlEvent?.surrender?.surrender_by ?? "";
  if (lastEBlEvent?.return) return lastEBlEvent?.return?.return_by ?? "";
  if (lastEBlEvent?.amendment_request) return lastEBlEvent?.amendment_request?.request_by ?? "";
  return "";
}

export const getNextPartyIDByAction = (record: EBlRecordType, action: EBlAllowAction): string => {
  const documentParties = eblParties(record)
  const lastEBlEvent = lastEvent(record);
  const issuerID = documentParties?.issuer ?? "";
  const consigneeID = documentParties?.consignee ?? "";
  const releaseAgentID = documentParties?.releaser ?? "";
  if (action === "TRANSFER") return consigneeID;
  if (action === "SURRENDER") return releaseAgentID;
  if (action === "REQUEST_AMEND") return issuerID;
  if (action === "AMEND" && lastEBlEvent?.amendment_request) return lastEBlEvent?.amendment_request?.request_by ?? "";
  if (action === "RETURN") { // to previous owner
    let previousOwnerID = ""
    if (lastEBlEvent?.transfer) previousOwnerID = lastEBlEvent?.transfer?.transfer_by ?? "";
    else if (lastEBlEvent?.surrender) previousOwnerID = lastEBlEvent?.surrender?.surrender_by ?? "";
    else if (lastEBlEvent?.amendment_request) previousOwnerID = lastEBlEvent?.amendment_request?.request_by ?? "";
    return previousOwnerID;
  }
  return ""
}

export const getNextPartyIDByCurrentStatus = (record: EBlRecordType, status: EBlStatusType): string => {
  const documentParties = eblParties(record)
  const lastEBlEvent = lastEvent(record);
  const shipperID = documentParties?.shipper ?? "";
  const consigneeID = documentParties?.consignee ?? "";
  const releaseAgentID = documentParties?.releaser ?? "";
  if (status === "TRANSFER") {
    return lastEBlEvent?.transfer?.transfer_to === shipperID ? consigneeID : releaseAgentID;
  }
  if (status === "REQUEST_AMEND") return lastEBlEvent?.amendment_request?.request_by ?? "";
  if (status === "RETURN") return lastEBlEvent?.return?.return_by ?? "";
  return ""
}

const statusFilters: [(e?: EBlEventType) => boolean, EBlStatusType][] = [
  [(event?) => !!event?.transfer, "TRANSFER"],
  [(event?) => !!event?.return, "RETURN"],
  [(event?) => !!event?.amendment_request, "REQUEST_AMEND"],
  [(event?) => !!event?.print_to_paper, "PRINT"],
  [(event?) => !!event?.surrender, "SURRENDER"],
  [(event?) => !!event?.accomplish, "ACCOMPLISH"],
];

const partyFunctionToPartyCodeMap = {
  DDR: "issuer",
  OS: "shipper",
  CN: "consignee",
  DDS: "releaser",
  COW: undefined,
  COX: undefined,
  MS: undefined,
  N1: undefined,
  N2: undefined,
  NI: undefined,
  HE: undefined,
  SCO: undefined,
  BA: undefined,
  ENR: undefined,
};

function partyCode(party: PartyType | undefined) {
  return party?.identifyingCodes?.find((code) => code?.partyCode)?.partyCode;
}
