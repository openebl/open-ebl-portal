import Fuse from "fuse.js";
import { createChannel, createClient } from "nice-grpc";
import { keys } from "remeda";

import { getLogger } from "@/lib/logger";
import { portName, ports } from "@/lib/ports";
import { type EBlFormType } from "@/types/ebl";
import { EBlDocType } from "@/types/ebl/common";
import {
  DocuSumDefinition,
  type ExtractDocumentRequest,
  type ListDocumentExtractionRequest,
} from "./protos/bluex_payment/docu_sum_service";
import { type DocExtractionType } from "./types";
import { DocuSumDocumentExtraction_DocInfo_Status } from "./protos/bluex_payment/docu_sum";
import { businessInfoList } from "@/server/fx/buinfo";

// Create an Document Extraction.
// uuid: unique id for the document
// fileName: name of the document
// content: content of the document
// If it fails to create a new document extraction, it throws an error.
const createExtraction = async ({
  uuid,
  filename,
  content,
}: {
  uuid: string;
  filename: string;
  content: Buffer;
}) => {
  const client = createClient(DocuSumDefinition, getChannel());
  const req: Partial<ExtractDocumentRequest> = {
    requestId: uuid,
    fileName: filename,
    file: content,
  };
  const res = await client.extractDocument(req);
  if (res.error) {
    getLogger().error(
      `Failed to create extraction to DocuSum: (${res.error.code}) ${res.error.message}`,
    );
    throw new Error(
      `Failed to create extraction to DocuSum: (${res.error.code}) ${res.error.message}`,
    );
  }
};

const InProgressStatusList = [
  DocuSumDocumentExtraction_DocInfo_Status.UNKNOWN,
  DocuSumDocumentExtraction_DocInfo_Status.REQUESTED,
  DocuSumDocumentExtraction_DocInfo_Status.WAITING_HIL,
];

// Get the document extraction by uuid.
// If the extraction is still in progress, it will return null.
// If the extraction is not found, it returns null.
// If it fails to get the extraction, it throws an error.
const getExtraction: (uuid: string) => Promise<EBlFormType | null> = async (
  uuid: string,
) => {
  const docInfo = await getDocInfo(uuid);
  if (!docInfo || InProgressStatusList.includes(docInfo.status)) return null;

  getLogger().info(`Got docInfo: ${JSON.stringify(docInfo)}`);

  const polCode = lookupPort(
    docInfo.originEntities.find((e) => e.label === "PortOfLoading")?.value,
  );
  const podCode = lookupPort(
    docInfo.originEntities.find((e) => e.label === "PortOfDischarge")?.value,
  );

  return {
    metadata: {
      username: "",
      docHash: "",
    },
    bl_number:
      docInfo.originEntities.find((e) => e.label === "BlNumber")?.value ?? "",
    bl_doc_type: EBlDocType.HouseBillOfLading,
    to_order: false,
    draft: true,
    file: {
      name: "",
      type: "",
      content: "",
    },
    shipper:
      (await lookupParty(
        docInfo.originEntities.find((e) => e.label === "Shipper")?.value,
      )) ?? "",
    consignee:
      (await lookupParty(
        docInfo.originEntities.find((e) => e.label === "Consignee")?.value,
      )) ?? "",
    release_agent:
      (await lookupParty(
        docInfo.originEntities.find((e) => e.label === "NotifyParty")?.value,
      )) ?? "",
    pol: {
      UNLocationCode: polCode ?? "",
      locationName: portName(polCode) ?? "",
    },
    pod: {
      UNLocationCode: podCode ?? "",
      locationName: portName(podCode) ?? "",
    },
  };
};

let sChannel: ReturnType<typeof createChannel> | null = null;

const getChannel = () => {
  if (sChannel) return sChannel;

  const docuSumAddr = process.env.DOCU_SUM_ADDR;
  if (!docuSumAddr) {
    throw new Error("DOCU_SUM_ADDR is not set");
  }

  sChannel = createChannel(docuSumAddr);
  return sChannel;
};

const getDocInfo = async (uuid: string) => {
  const client = createClient(DocuSumDefinition, getChannel());
  const req: Partial<ListDocumentExtractionRequest> = {
    requestIds: [uuid],
    limit: 1,
  };
  const res = client.listDocumentExtraction(req);
  for await (const item of res) {
    if (item.extraction) {
      const docInfos =
        item.extraction.reference?.docInfos ?? item.extraction.data?.docInfos;
      return docInfos?.[0];
    }
  }

  return null;
};

const portFuseOpts = {
  includeScore: false,
  keys: ["name", "value"],
};

const portFuse = new Fuse(ports, portFuseOpts);

const lookupPort = (port?: string) => {
  if (!port) return undefined;
  return portFuse.search(port)[0]?.item?.value;
};

const lookupParty = async (name?: string) => {
  if (!name) return undefined;

  const buList = await businessInfoList();
  if (!buList) return undefined;

  const partyFuse = new Fuse(
    keys(buList).map((k) => ({ ...buList[k], did: k })),
    {
      includeScore: false,
      keys: ["legalBusinessName"],
    },
  );

  return partyFuse.search(name)[0]?.item?.did;
};

export const bxDocExtraction: DocExtractionType = {
  createExtraction,
  getExtraction,
};
