import { type components, type external } from "@/types/bu-scheme";
import { findLast, last } from "remeda";

type EBlRecordType = components["schemas"]["BillOfLadingRecord"];
type EBlEventType = components["schemas"]["BillOfLadingEvent"];
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
  | "AMEND"
  | "SURRENDER"
  | "PRINT"
  | "ACCOMPLISH"
  | "UNKNOWN";

export function lastEvent(record: EBlRecordType) {
  if (!record.bl?.events) return undefined;
  return last(record.bl?.events);
}

export function latestBillOfLading(record: EBlRecordType) {
  if (!record.bl?.events) return undefined;

  // find the last ISSUED event
  const event = findLast(
    record.bl.events,
    (event) => !!event.bill_of_lading?.bill_of_lading?.shippingInstruction,
  );

  return event?.bill_of_lading?.bill_of_lading;
}

export function currentStatus(record: EBlRecordType): EBlStatusType {
  if (!record.bl?.events) return "UNKNOWN";

  const lastEvent = last(record.bl?.events);
  return statusFilters.find(([pred]) => pred(lastEvent))?.[1] ?? "UNKNOWN";
}

export function eblParties(
  record: EBlRecordType,
): EBlPartiesType | undefined {
  if (!record?.bl?.events) return undefined;

  // find the last ISSUED event
  const issueEvent = findLast(
    record.bl.events,
    (event) =>
      event.bill_of_lading?.bill_of_lading?.shippingInstruction
        ?.documentStatus === "ISSU",
  );

  return issueEvent?.bill_of_lading?.bill_of_lading?.shippingInstruction?.documentParties?.reduce(
    (acc, party) => {
      if (!party.partyFunction) return acc;

      const key = partyFunctionToPartyCodeMap[party.partyFunction];
      return key ? { ...acc, [key]: partyCode(party.party) } : acc;
    },
    {} as EBlPartiesType,
  );
}

const statusFilters: [(e?: EBlEventType) => boolean, EBlStatusType][] = [
  [(event?) => !!event?.transfer, "TRANSFER"],
  [(event?) => !!event?.return, "RETURN"],
  [(event?) => !!event?.amendment_request, "AMEND"],
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
