import Fuse from "fuse.js";
import { createChannel, createClient } from "nice-grpc";
import { keys } from "remeda";

import { getLogger } from "@/lib/logger";
import { platforms } from "@/lib/platforms";
import { ports } from "@/lib/ports";
import {
  DocuSumDefinition,
  type ExtractDocumentRequest,
  type ListDocumentExtractionRequest,
} from "./protos/bluex_payment/docu_sum_service";

type ExtractedDocInfo = {
  blNumber?: string;
  shipper?: string;
  consignee?: string;
  releaseAgent?: string;
  pol?: string;
  pod?: string;
};

// Create an Document Extraction.
// uuid: unique id for the document
// fileName: name of the document
// content: content of the document
// If it fails to create a new document extraction, it throws an error.
export const createExtraction = async (
  uuid: string,
  fileName: string,
  content: Buffer,
) => {
  const client = createClient(DocuSumDefinition, getChannel());
  const req: Partial<ExtractDocumentRequest> = {
    requestId: uuid,
    fileName,
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

// Get the document extraction by uuid.
// If the extraction is still in progress, it will return null.
// If the extraction is not found, it returns null.
// If it fails to get the extraction, it throws an error.
export const getExtraction: (
  uuid: string,
) => Promise<ExtractedDocInfo | null> = async (uuid: string) => {
  const docInfo = await getDocInfo(uuid);
  if (!docInfo) return null;

  return {
    blNumber: docInfo.originEntities.find((e) => e.label === "BlNumber")
      ?.value,
    shipper: lookupParty(
      docInfo.originEntities.find((e) => e.label === "Shipper")?.value,
    ),
    consignee: lookupParty(
      docInfo.originEntities.find((e) => e.label === "Consignee")?.value,
    ),
    releaseAgent: lookupParty(
      docInfo.originEntities.find((e) => e.label === "NotifyParty")?.value,
    ),
    pol: lookupPort(
      docInfo.originEntities.find((e) => e.label === "PortOfLoading")?.value,
    ),
    pod: lookupPort(
      docInfo.originEntities.find((e) => e.label === "PortOfDischarge")?.value,
    ),
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
      const docInfos = item.extraction.reference?.docInfos ?? item.extraction.data?.docInfos;
      return docInfos?.[0];
    }
  }

  return null;
};

const portFusreOpts = {
  includeScore: false,
  keys: ["name", "value"],
};

const portFuse = new Fuse(ports, portFusreOpts);

const lookupPort = (port?: string) => {
  if (!port) return undefined;
  return portFuse.search(port)[0]?.item?.value;
};

const partyFuse = new Fuse(
  keys(platforms).map((k) => ({ ...platforms[k], did: k })),
  {
    includeScore: false,
    keys: ["name", "legalName"],
  },
);

const lookupParty = (name?: string) => {
  if (!name) return undefined;
  return partyFuse.search(name)[0]?.item?.did;
};
