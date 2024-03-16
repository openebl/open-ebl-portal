import { type components } from "@/types/bu-scheme";
import { findLast, last } from "remeda";

type EBlRecordType = components["schemas"]["BillOfLadingRecord"];
type EBlEventType = components["schemas"]["BillOfLadingEvent"];

export type EBlPartiesType = {
  issuer?: string;
  shipper?: string;
  consignee?: string;
  releaser?: string;
};

export type EBlStatusType = "TRANSFER" | "RETURN" | "AMEND" | "SURRENDER" | "PRINT" | "ACCOMPLISH" | "UNKNOWN";

export function currentStatus(
  record: EBlRecordType,
): EBlStatusType {
  if (!record.bl?.events) return "UNKNOWN";

  const lastEvent = last(record.bl?.events)
  return statusFilters.find(([pred]) => pred(lastEvent))?.[1] ?? "UNKNOWN";
}

export function extractParties(
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
      return { ...acc, [key]: partyCode(party.party) };
    },
    {} as EBlPartiesType,
  );
}

const statusFilters: [(e?: EBlEventType) => boolean, EBlStatusType][] = [
  [(event?) => !!event?.transfer, 'TRANSFER'],
  [(event?) => !!event?.return, 'RETURN'],
  [(event?) => !!event?.amendment_request, 'AMEND'],
  [(event?) => !!event?.print_to_paper, 'PRINT'],
  [(event?) => !!event?.accomplish, 'SURRENDER'],
  [(event?) => !!event?.accomplish, 'ACCOMPLISH'],
];

const partyFunctionToPartyCodeMap = {
  DDR: "issuer",
  OS: "shipper",
  CN: "consignee",
  DDS: "releaser",
};

function partyCode(party: components["schemas"]["Party"] | undefined) {
  return party?.identifyingCodes?.find((code) => code?.partyCode)?.partyCode;
}
