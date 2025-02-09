import { MaosClient } from "@bluexlab/maos-ts";
import { eq } from "drizzle-orm";
import Fuse from "fuse.js";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { keys } from "remeda";
import { z } from "zod";

import { DocExtractions } from "@/drizzle/schema";
import { env } from "@/env";
import { getLogger } from "@/lib/logger";
import { ports } from "@/lib/ports";
import { db } from "@/server/db";
import { businessInfoList } from "@/server/fx/buinfo";
import { type EBlFormType } from "@/types/ebl";
import { EBlDocType } from "@/types/ebl/common";
import { type DocExtractionType } from "./types";

// Create an Document Extraction.
// uuid: unique id for the document
// fileName: name of the document
// content: content of the document
// If it fails to create a new document extraction, it throws an error.
const createExtraction = async ({ uuid, filename, content }: { uuid: string; filename: string; content: Buffer }) => {
  // const client = createClient(DocuSumDefinition, getChannel());
  // const req: Partial<ExtractDocumentRequest> = {
  //   requestId: uuid,
  //   fileName: filename,
  //   file: content,
  // };
  // const res = await client.extractDocument(req);
  // if (res.error) {
  //   getLogger().error(`Failed to create extraction to DocuSum: (${res.error.code}) ${res.error.message}`);
  //   throw new Error(`Failed to create extraction to DocuSum: (${res.error.code}) ${res.error.message}`);
  // }
};

const getExtraction: (uuid: string) => Promise<{ status: string; ebl?: EBlFormType; error?: string } | null> = async (
  uuid: string,
) => {
  const [extraction] = await db.select().from(DocExtractions).limit(1).where(eq(DocExtractions.id, uuid));
  if (!extraction) return null;
  if (extraction.status !== "completed")
    return {
      status: extraction.status ?? "processing",
      error: extraction.error ?? undefined,
    };

  if (!extraction.result)
    return {
      status: "failed",
      error: "Missing extraction result",
    };

  const res = docExtractResponseSchema.safeParse(extraction.result);
  if (!res.success) {
    logger.error(`Invalid DocExtraction result: ${String(res.error)}`);
    logger.error(`DocExtraction result: ${JSON.stringify(extraction.result)}`);
    return null;
  }

  const ebl = await mapDocInfoToEBlForm(res.data);

  return { status: extraction.status, ebl };
};

const extractDocument = async (uuid: string, content: Buffer) => {
  const maos = new MaosClient({
    apiKey: env.MAOS_API_KEY,
    coreUrl: env.MAOS_CORE_URL,
  });

  const fileBase64Content = content.toString("base64");

  await maos
    .executeAsync(env.DOC_SPLITTER_ACTOR_NAME, "", { file: fileBase64Content })
    .andThen((responder) => {
      return responder.getResult(60).andThen((result) => {
        if (typeof result.state !== "string" || result.state !== "completed") {
          return errAsync(new Error("Doc splitting timeout"));
        }
        return okAsync(result);
      });
    })
    .andThen((result) => {
      const res = docSplitterResponseSchema.safeParse(result.result);
      if (!res.success) {
        return errAsync(new Error(`invalid doc splitter response: ${String(result.result)}: ${res.error.toString()}`));
      }
      if (res.data.documents.length === 0) {
        return errAsync(new Error("No documents found in doc splitter"));
      }
      return okAsync(res.data.documents);
    })
    .andThen((documents) => {
      const request = {
        document_type: documents[0]!.document_type,
      };
      return maos.executeAsync(env.DOC_TYPE_NORMALIZER_ACTOR_NAME, "", request).andThen((responder) => {
        return responder
          .getResult(60)
          .andThen((result) => {
            if (typeof result.state !== "string" || result.state !== "completed") {
              return errAsync(new Error("Doc type normalizer timeout"));
            }
            return okAsync(result);
          })
          .andThen((result) => {
            return okAsync({ result, pages: documents[0]!.pages });
          });
      });
    })
    .andThen((result) => {
      const res = docTypeNormalizeResponseSchema.safeParse(result.result.result);
      if (!res.success) {
        return errAsync(new Error(res.error.toString()));
      }
      const request = {
        document_type: res.data.document_type,
        pdf_file: {
          file: fileBase64Content,
          pages: result.pages,
        },
        enable_hallucination_guard: true,
      };
      return maos.executeAsync(env.DOC_EXTRACT_ACTOR_NAME, "", request).andThen((responder) => {
        return responder
          .getResult(69)
          .andThen((result) => {
            if (typeof result.state !== "string" || result.state !== "completed") {
              return errAsync(new Error("Doc extraction timeout"));
            }
            return okAsync(result);
          })
          .andThen((result) => {
            return okAsync(result);
          });
      });
    })
    .andThen((result) => {
      const updateToDb = async () => {
        logger.info(`Doc extraction ${uuid} completed: ${JSON.stringify(result.result)}`);
        await db
          .update(DocExtractions)
          .set({ status: "completed", result: result.result, updatedAt: new Date() })
          .where(eq(DocExtractions.id, uuid));
      };
      return ResultAsync.fromPromise(updateToDb(), (err) => err);
    })
    .match(
      () => {
        console.log(`Doc extraction completed: ${uuid}`);
      },
      (err) => {
        console.error("Error:", err);
        db.update(DocExtractions)
          .set({
            status: "failed",
            error: String(`Cannot create DocExtraction error: ${String(err)}`),
            updatedAt: new Date(),
          })
          .where(eq(DocExtractions.id, uuid))
          .catch((e) => {
            logger.error(`Cannot update DocExtraction error: ${String(e)}`);
          });
      },
    );
};

const mapDocInfoToEBlForm: (info: DocExtractResponseSchema) => Promise<EBlFormType> = async (
  info: DocExtractResponseSchema,
) => {
  const polCode = lookupPort(info.PortOfLoading);
  const podCode = lookupPort(info.PortOfDischarge);
  return {
    metadata: {
      username: "",
      docHash: undefined,
    },
    bl_number: "",
    bl_doc_type: EBlDocType.HouseBillOfLading,
    to_order: false,
    draft: true,
    file: {
      name: "",
      type: "",
      content: "",
    },
    shipper: "",
    consignee: "",
    release_agent: "",
    pol: {
      UNLocationCode: "",
      locationName: "",
    },
    pod: {
      UNLocationCode: "",
      locationName: "",
    },
    endorsee: null,
    notify_parties: null,
    note: null,
  };

  // const docInfo = await getDocInfo(uuid);
  // if (!docInfo || InProgressStatusList.includes(docInfo.status)) return null;

  // getLogger().info(`Got docInfo: ${JSON.stringify(docInfo)}`);

  // const polCode = lookupPort(docInfo.originEntities.find((e) => e.label === "PortOfLoading")?.value);
  // const podCode = lookupPort(docInfo.originEntities.find((e) => e.label === "PortOfDischarge")?.value);

  // return {
  //   metadata: {
  //     username: "",
  //     docHash: "",
  //   },
  //   bl_number: docInfo.originEntities.find((e) => e.label === "BlNumber")?.value ?? "",
  //   bl_doc_type: EBlDocType.HouseBillOfLading,
  //   to_order: false,
  //   draft: true,
  //   file: {
  //     name: "",
  //     type: "",
  //     content: "",
  //   },
  //   shipper: (await lookupParty(docInfo.originEntities.find((e) => e.label === "Shipper")?.value)) ?? "",
  //   consignee: (await lookupParty(docInfo.originEntities.find((e) => e.label === "Consignee")?.value)) ?? "",
  //   release_agent:
  //     (await lookupParty(
  //       docInfo.originEntities.find((e) => e.label === "NotifyParty" || e.label === "DeliveryAgent")?.value,
  //     )) ?? "",
  //   pol: {
  //     UNLocationCode: polCode ?? "",
  //     locationName: portName(polCode) ?? "",
  //   },
  //   pod: {
  //     UNLocationCode: podCode ?? "",
  //     locationName: portName(podCode) ?? "",
  //   },
  // };
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
