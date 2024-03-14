/* eslint-disable */
import Long from "long";
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";
import { Error } from "../bluex_errors/error";
import {
  DocuSumDocument,
  DocuSumDocumentBatch,
  DocuSumDocumentBatch_Status,
  DocuSumDocumentExtraction,
  DocuSumDocumentSummary_BillOfLading,
  DocuSumDocumentSummary_BillSummary,
  DocuSumDocumentSummary_CustomsSummaryNote,
  DocuSumDocumentSummary_Email,
  DocuSumDocumentSummary_Invoice,
  DocuSumDocumentSummary_PackingList,
  DocuSumDocumentSummary_ProofOfDelivery,
  DocuSumDocumentSummary_WareHouseSummary,
  docuSumDocumentBatch_StatusFromJSON,
  docuSumDocumentBatch_StatusToJSON,
} from "./docu_sum";

export const protobufPackage = "bluex_payment";

export interface CreateDocumentBatchRequest {
  platformId: number;
  userId: number;
  requesterId: string;
}

export interface CreateDocumentBatchResponse {
  error: Error | undefined;
  batch: DocuSumDocumentBatch | undefined;
}

export interface ListDocumentBatchRequest {
  platformId: number;
  userId: number;
  requesterId: string;
  offset: number;
  limit: number;
  ids: string[];
  platformIds: number[];
  statuses: DocuSumDocumentBatch_Status[];
}

export interface DocumentBatchRecord {
  data:
    | DocuSumDocumentBatch
    | undefined;
  /** What actions are allowed for this batch. */
  allowedActions: DocumentBatchRecord_Action[];
  docs: DocumentRecord[];
}

export enum DocumentBatchRecord_Action {
  UNKNOWN = 0,
  DELETE = 1,
  UPLOAD_DOCUMENT = 2,
  REMOVE_DOCUMENT = 3,
  ORGANIZE_DOCUMENT = 4,
  PUBLISH = 5,
  UNRECOGNIZED = -1,
}

export function documentBatchRecord_ActionFromJSON(object: any): DocumentBatchRecord_Action {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return DocumentBatchRecord_Action.UNKNOWN;
    case 1:
    case "DELETE":
      return DocumentBatchRecord_Action.DELETE;
    case 2:
    case "UPLOAD_DOCUMENT":
      return DocumentBatchRecord_Action.UPLOAD_DOCUMENT;
    case 3:
    case "REMOVE_DOCUMENT":
      return DocumentBatchRecord_Action.REMOVE_DOCUMENT;
    case 4:
    case "ORGANIZE_DOCUMENT":
      return DocumentBatchRecord_Action.ORGANIZE_DOCUMENT;
    case 5:
    case "PUBLISH":
      return DocumentBatchRecord_Action.PUBLISH;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DocumentBatchRecord_Action.UNRECOGNIZED;
  }
}

export function documentBatchRecord_ActionToJSON(object: DocumentBatchRecord_Action): string {
  switch (object) {
    case DocumentBatchRecord_Action.UNKNOWN:
      return "UNKNOWN";
    case DocumentBatchRecord_Action.DELETE:
      return "DELETE";
    case DocumentBatchRecord_Action.UPLOAD_DOCUMENT:
      return "UPLOAD_DOCUMENT";
    case DocumentBatchRecord_Action.REMOVE_DOCUMENT:
      return "REMOVE_DOCUMENT";
    case DocumentBatchRecord_Action.ORGANIZE_DOCUMENT:
      return "ORGANIZE_DOCUMENT";
    case DocumentBatchRecord_Action.PUBLISH:
      return "PUBLISH";
    case DocumentBatchRecord_Action.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface DocumentRecord {
  data: DocuSumDocument | undefined;
  allowedActions: DocumentRecord_Action[];
}

export enum DocumentRecord_Action {
  UNKNOWN = 0,
  CONFIRM = 1,
  UNRECOGNIZED = -1,
}

export function documentRecord_ActionFromJSON(object: any): DocumentRecord_Action {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return DocumentRecord_Action.UNKNOWN;
    case 1:
    case "CONFIRM":
      return DocumentRecord_Action.CONFIRM;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DocumentRecord_Action.UNRECOGNIZED;
  }
}

export function documentRecord_ActionToJSON(object: DocumentRecord_Action): string {
  switch (object) {
    case DocumentRecord_Action.UNKNOWN:
      return "UNKNOWN";
    case DocumentRecord_Action.CONFIRM:
      return "CONFIRM";
    case DocumentRecord_Action.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ListDocumentBatchResponse {
  error: Error | undefined;
  report: ListDocumentBatchResponse_Report | undefined;
  batch: DocumentBatchRecord | undefined;
}

export interface ListDocumentBatchResponse_Report {
  total: number;
}

export interface OrganizeDocumentBatchRequest {
  platformId: number;
  userId: number;
  requesterId: string;
  batchId: string;
  version: number;
  groups: OrganizeDocumentBatchRequest_Group[];
}

export interface OrganizeDocumentBatchRequest_Group {
  /** group id */
  id: string;
  /** supporting document IDs. (invoice is excluded.) */
  documentIds: string[];
}

export interface OrganizeDocumentBatchResponse {
  error: Error | undefined;
  batch: DocumentBatchRecord | undefined;
}

export interface UploadDocumentRequest {
  platformId: number;
  userId: number;
  requesterId: string;
  batchId: string;
  version: number;
  /** file name with extension */
  fileName: string;
  /** file */
  file: Uint8Array;
}

export interface UploadDocumentResponse {
  error: Error | undefined;
  doc: DocuSumDocument | undefined;
}

export interface DeleteDocumentBatchRequest {
  platformId: number;
  userId: number;
  requesterId: string;
  batchId: string;
  version: number;
}

export interface DeleteDocumentBatchResponse {
  error: Error | undefined;
}

export interface RemoveDocumentsRequest {
  platformId: number;
  userId: number;
  requesterId: string;
  batchId: string;
  batchVersion: number;
  documentIds: string[];
}

export interface RemoveDocumentsResponse {
  error: Error | undefined;
}

export interface ConfirmDocumentRequest {
  platformId: number;
  userId: number;
  requesterId: string;
  batchId: string;
  id: string;
  version: number;
  /**
   * type can be the following values:
   *  "invoice"
   *  "packing list"
   *  "bill of lading"
   *  "arrival notice"
   *  "proof of delivery"
   *  "warehouse aging report"
   *  "warehouse summary"
   *  "customs summary note"
   *  "airway bill"
   *  "bill summary"
   *  "eMail"
   */
  docType: string;
  invoice: DocuSumDocumentSummary_Invoice | undefined;
  packingList: DocuSumDocumentSummary_PackingList | undefined;
  billOfLading: DocuSumDocumentSummary_BillOfLading | undefined;
  arrivalNotice: DocuSumDocumentSummary_BillOfLading | undefined;
  proofOfDelivery: DocuSumDocumentSummary_ProofOfDelivery | undefined;
  warehouseAgingReport: DocuSumDocumentSummary_WareHouseSummary | undefined;
  warehouseSummary: DocuSumDocumentSummary_WareHouseSummary | undefined;
  airwayBill: DocuSumDocumentSummary_BillOfLading | undefined;
  customsSummaryNote: DocuSumDocumentSummary_CustomsSummaryNote | undefined;
  billSummary: DocuSumDocumentSummary_BillSummary | undefined;
  email: DocuSumDocumentSummary_Email | undefined;
}

export interface ConfirmDocumentResponse {
  error: Error | undefined;
  doc: DocuSumDocument | undefined;
}

export interface GetDocumentDownloadURLRequest {
  platformId: number;
  userId: number;
  requesterId: string;
  fileId: string;
  /** in seconds */
  liveTime: number;
}

export interface GetDocumentDownloadURLResponse {
  error: Error | undefined;
  url: string;
}

export interface PublishDocumentBatchRequest {
  platformId: number;
  userId: number;
  requesterId: string;
  batchId: string;
  version: number;
}

export interface PublishDocumentBatchResponse {
  error: Error | undefined;
}

export interface ExtractDocumentRequest {
  /** Specified by the caller. It should be global unique and the same file must use the same request_id. */
  requestId: string;
  fileName: string;
  file: Uint8Array;
  metadata: string;
}

export interface ExtractDocumentResponse {
  error: Error | undefined;
  extraction: DocumentExtractionRecord | undefined;
}

export interface DocumentExtractionRecord {
  data:
    | DocuSumDocumentExtraction
    | undefined;
  /** indicates the original DocumentExtraction if the current record is a duplication. */
  reference:
    | DocuSumDocumentExtraction
    | undefined;
  /** @deprecated */
  allowedAdminActions: DocumentExtractionRecord_AdminAction[];
  hilGcsDestination: string;
  docInfoAllowActions: DocumentExtractionRecord_DocInfoAllowAction[];
}

export enum DocumentExtractionRecord_AdminAction {
  ADMIN_ACT_UNKNOWN = 0,
  REVIEW = 1,
  UNRECOGNIZED = -1,
}

export function documentExtractionRecord_AdminActionFromJSON(object: any): DocumentExtractionRecord_AdminAction {
  switch (object) {
    case 0:
    case "ADMIN_ACT_UNKNOWN":
      return DocumentExtractionRecord_AdminAction.ADMIN_ACT_UNKNOWN;
    case 1:
    case "REVIEW":
      return DocumentExtractionRecord_AdminAction.REVIEW;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DocumentExtractionRecord_AdminAction.UNRECOGNIZED;
  }
}

export function documentExtractionRecord_AdminActionToJSON(object: DocumentExtractionRecord_AdminAction): string {
  switch (object) {
    case DocumentExtractionRecord_AdminAction.ADMIN_ACT_UNKNOWN:
      return "ADMIN_ACT_UNKNOWN";
    case DocumentExtractionRecord_AdminAction.REVIEW:
      return "REVIEW";
    case DocumentExtractionRecord_AdminAction.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface DocumentExtractionRecord_DocInfoAllowAction {
  docInfoId: string;
  allowedAdminActions: DocumentExtractionRecord_AdminAction[];
}

export interface ListDocumentExtractionRequest {
  platformId: number;
  userId: number;
  requesterId: string;
  offset: number;
  limit: number;
  includeHilInfo: boolean;
  ids: string[];
  requestIds: string[];
}

export interface ListDocumentExtractionResponse {
  error: Error | undefined;
  extraction: DocumentExtractionRecord | undefined;
}

export interface ReviewDocumentExtractionRequest {
  platformId: number;
  userId: number;
  requesterId: string;
  id: string;
  version: number;
  docInfoId: string;
  /**
   * correct fields will be filled with correct labels, e.g.
   * ["file_type","Consignee","InvoiceNumber"]
   * for plural label, the syntax will be {label}.{index}, e.g.
   * ["container.0", "container.2"]
   * for line items, the syntax will be {parent label}.{index}.{label}, e.g.
   * ["ChargeItems.0.ChargeItems/Quantity", "ChargeItems.1.ChargeItems/Unit"]
   * the `index` is zero-based
   */
  correctFields: string[];
  /**
   * incorrect fields will be filled with incorrect labels, e.g.
   * ["file_type","ShipTo","B/L Number"]
   * for plural label, the syntax will be {label}.{index}, e.g.
   * ["container.1", "container.3"]
   * for line items, the syntax will be {parent label}.{index}.{label}, e.g.
   * ["ChargeItems.0.ChargeItems/Unit", "ChargeItems.2.ChargeItems/Weight"]
   * the `index` is zero-based
   */
  incorrectFields: string[];
}

export interface ReviewDocumentExtractionResponse {
  error: Error | undefined;
  extraction: DocumentExtractionRecord | undefined;
}

export interface GetDocumentExtractionDownloadURLRequest {
  platformId: number;
  userId: number;
  requesterId: string;
  /** DocumentExtraction ID */
  id: string;
  /** in seconds */
  liveTime: number;
}

export interface GetDocumentExtractionDownloadURLResponse {
  error: Error | undefined;
  url: string;
}

export interface DataPipelineBootUpRequest {
  stream: DataPipelineBootUpRequest_Stream;
  /** Resend data from the specified time. It's UNIX time. */
  since: number;
}

export enum DataPipelineBootUpRequest_Stream {
  STREAM_UNSPECIFIED = 0,
  STREAM_DOCUMENT_BATCH = 1,
  STREAM_DOCUMENT = 2,
  STREAM_DOCUMENT_EXTRACTION = 3,
  UNRECOGNIZED = -1,
}

export function dataPipelineBootUpRequest_StreamFromJSON(object: any): DataPipelineBootUpRequest_Stream {
  switch (object) {
    case 0:
    case "STREAM_UNSPECIFIED":
      return DataPipelineBootUpRequest_Stream.STREAM_UNSPECIFIED;
    case 1:
    case "STREAM_DOCUMENT_BATCH":
      return DataPipelineBootUpRequest_Stream.STREAM_DOCUMENT_BATCH;
    case 2:
    case "STREAM_DOCUMENT":
      return DataPipelineBootUpRequest_Stream.STREAM_DOCUMENT;
    case 3:
    case "STREAM_DOCUMENT_EXTRACTION":
      return DataPipelineBootUpRequest_Stream.STREAM_DOCUMENT_EXTRACTION;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DataPipelineBootUpRequest_Stream.UNRECOGNIZED;
  }
}

export function dataPipelineBootUpRequest_StreamToJSON(object: DataPipelineBootUpRequest_Stream): string {
  switch (object) {
    case DataPipelineBootUpRequest_Stream.STREAM_UNSPECIFIED:
      return "STREAM_UNSPECIFIED";
    case DataPipelineBootUpRequest_Stream.STREAM_DOCUMENT_BATCH:
      return "STREAM_DOCUMENT_BATCH";
    case DataPipelineBootUpRequest_Stream.STREAM_DOCUMENT:
      return "STREAM_DOCUMENT";
    case DataPipelineBootUpRequest_Stream.STREAM_DOCUMENT_EXTRACTION:
      return "STREAM_DOCUMENT_EXTRACTION";
    case DataPipelineBootUpRequest_Stream.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface DataPipelineBootUpResponse {
  error: Error | undefined;
}

function createBaseCreateDocumentBatchRequest(): CreateDocumentBatchRequest {
  return { platformId: 0, userId: 0, requesterId: "" };
}

export const CreateDocumentBatchRequest = {
  encode(message: CreateDocumentBatchRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platformId !== 0) {
      writer.uint32(8).int64(message.platformId);
    }
    if (message.userId !== 0) {
      writer.uint32(16).int64(message.userId);
    }
    if (message.requesterId !== "") {
      writer.uint32(26).string(message.requesterId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateDocumentBatchRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateDocumentBatchRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.platformId = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.userId = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.requesterId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateDocumentBatchRequest {
    return {
      platformId: isSet(object.platformId) ? globalThis.Number(object.platformId) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      requesterId: isSet(object.requesterId) ? globalThis.String(object.requesterId) : "",
    };
  },

  toJSON(message: CreateDocumentBatchRequest): unknown {
    const obj: any = {};
    if (message.platformId !== 0) {
      obj.platformId = Math.round(message.platformId);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.requesterId !== "") {
      obj.requesterId = message.requesterId;
    }
    return obj;
  },

  create(base?: DeepPartial<CreateDocumentBatchRequest>): CreateDocumentBatchRequest {
    return CreateDocumentBatchRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateDocumentBatchRequest>): CreateDocumentBatchRequest {
    const message = createBaseCreateDocumentBatchRequest();
    message.platformId = object.platformId ?? 0;
    message.userId = object.userId ?? 0;
    message.requesterId = object.requesterId ?? "";
    return message;
  },
};

function createBaseCreateDocumentBatchResponse(): CreateDocumentBatchResponse {
  return { error: undefined, batch: undefined };
}

export const CreateDocumentBatchResponse = {
  encode(message: CreateDocumentBatchResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    if (message.batch !== undefined) {
      DocuSumDocumentBatch.encode(message.batch, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateDocumentBatchResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateDocumentBatchResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.batch = DocuSumDocumentBatch.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateDocumentBatchResponse {
    return {
      error: isSet(object.error) ? Error.fromJSON(object.error) : undefined,
      batch: isSet(object.batch) ? DocuSumDocumentBatch.fromJSON(object.batch) : undefined,
    };
  },

  toJSON(message: CreateDocumentBatchResponse): unknown {
    const obj: any = {};
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    if (message.batch !== undefined) {
      obj.batch = DocuSumDocumentBatch.toJSON(message.batch);
    }
    return obj;
  },

  create(base?: DeepPartial<CreateDocumentBatchResponse>): CreateDocumentBatchResponse {
    return CreateDocumentBatchResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateDocumentBatchResponse>): CreateDocumentBatchResponse {
    const message = createBaseCreateDocumentBatchResponse();
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    message.batch = (object.batch !== undefined && object.batch !== null)
      ? DocuSumDocumentBatch.fromPartial(object.batch)
      : undefined;
    return message;
  },
};

function createBaseListDocumentBatchRequest(): ListDocumentBatchRequest {
  return { platformId: 0, userId: 0, requesterId: "", offset: 0, limit: 0, ids: [], platformIds: [], statuses: [] };
}

export const ListDocumentBatchRequest = {
  encode(message: ListDocumentBatchRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platformId !== 0) {
      writer.uint32(8).int64(message.platformId);
    }
    if (message.userId !== 0) {
      writer.uint32(16).int64(message.userId);
    }
    if (message.requesterId !== "") {
      writer.uint32(26).string(message.requesterId);
    }
    if (message.offset !== 0) {
      writer.uint32(32).int64(message.offset);
    }
    if (message.limit !== 0) {
      writer.uint32(40).int64(message.limit);
    }
    for (const v of message.ids) {
      writer.uint32(50).string(v!);
    }
    writer.uint32(58).fork();
    for (const v of message.platformIds) {
      writer.int64(v);
    }
    writer.ldelim();
    writer.uint32(66).fork();
    for (const v of message.statuses) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListDocumentBatchRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListDocumentBatchRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.platformId = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.userId = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.requesterId = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.offset = longToNumber(reader.int64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.limit = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.ids.push(reader.string());
          continue;
        case 7:
          if (tag === 56) {
            message.platformIds.push(longToNumber(reader.int64() as Long));

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.platformIds.push(longToNumber(reader.int64() as Long));
            }

            continue;
          }

          break;
        case 8:
          if (tag === 64) {
            message.statuses.push(reader.int32() as any);

            continue;
          }

          if (tag === 66) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.statuses.push(reader.int32() as any);
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListDocumentBatchRequest {
    return {
      platformId: isSet(object.platformId) ? globalThis.Number(object.platformId) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      requesterId: isSet(object.requesterId) ? globalThis.String(object.requesterId) : "",
      offset: isSet(object.offset) ? globalThis.Number(object.offset) : 0,
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      ids: globalThis.Array.isArray(object?.ids) ? object.ids.map((e: any) => globalThis.String(e)) : [],
      platformIds: globalThis.Array.isArray(object?.platformIds)
        ? object.platformIds.map((e: any) => globalThis.Number(e))
        : [],
      statuses: globalThis.Array.isArray(object?.statuses)
        ? object.statuses.map((e: any) => docuSumDocumentBatch_StatusFromJSON(e))
        : [],
    };
  },

  toJSON(message: ListDocumentBatchRequest): unknown {
    const obj: any = {};
    if (message.platformId !== 0) {
      obj.platformId = Math.round(message.platformId);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.requesterId !== "") {
      obj.requesterId = message.requesterId;
    }
    if (message.offset !== 0) {
      obj.offset = Math.round(message.offset);
    }
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.ids?.length) {
      obj.ids = message.ids;
    }
    if (message.platformIds?.length) {
      obj.platformIds = message.platformIds.map((e) => Math.round(e));
    }
    if (message.statuses?.length) {
      obj.statuses = message.statuses.map((e) => docuSumDocumentBatch_StatusToJSON(e));
    }
    return obj;
  },

  create(base?: DeepPartial<ListDocumentBatchRequest>): ListDocumentBatchRequest {
    return ListDocumentBatchRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListDocumentBatchRequest>): ListDocumentBatchRequest {
    const message = createBaseListDocumentBatchRequest();
    message.platformId = object.platformId ?? 0;
    message.userId = object.userId ?? 0;
    message.requesterId = object.requesterId ?? "";
    message.offset = object.offset ?? 0;
    message.limit = object.limit ?? 0;
    message.ids = object.ids?.map((e) => e) || [];
    message.platformIds = object.platformIds?.map((e) => e) || [];
    message.statuses = object.statuses?.map((e) => e) || [];
    return message;
  },
};

function createBaseDocumentBatchRecord(): DocumentBatchRecord {
  return { data: undefined, allowedActions: [], docs: [] };
}

export const DocumentBatchRecord = {
  encode(message: DocumentBatchRecord, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.data !== undefined) {
      DocuSumDocumentBatch.encode(message.data, writer.uint32(10).fork()).ldelim();
    }
    writer.uint32(18).fork();
    for (const v of message.allowedActions) {
      writer.int32(v);
    }
    writer.ldelim();
    for (const v of message.docs) {
      DocumentRecord.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DocumentBatchRecord {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDocumentBatchRecord();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.data = DocuSumDocumentBatch.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag === 16) {
            message.allowedActions.push(reader.int32() as any);

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.allowedActions.push(reader.int32() as any);
            }

            continue;
          }

          break;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.docs.push(DocumentRecord.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DocumentBatchRecord {
    return {
      data: isSet(object.data) ? DocuSumDocumentBatch.fromJSON(object.data) : undefined,
      allowedActions: globalThis.Array.isArray(object?.allowedActions)
        ? object.allowedActions.map((e: any) => documentBatchRecord_ActionFromJSON(e))
        : [],
      docs: globalThis.Array.isArray(object?.docs) ? object.docs.map((e: any) => DocumentRecord.fromJSON(e)) : [],
    };
  },

  toJSON(message: DocumentBatchRecord): unknown {
    const obj: any = {};
    if (message.data !== undefined) {
      obj.data = DocuSumDocumentBatch.toJSON(message.data);
    }
    if (message.allowedActions?.length) {
      obj.allowedActions = message.allowedActions.map((e) => documentBatchRecord_ActionToJSON(e));
    }
    if (message.docs?.length) {
      obj.docs = message.docs.map((e) => DocumentRecord.toJSON(e));
    }
    return obj;
  },

  create(base?: DeepPartial<DocumentBatchRecord>): DocumentBatchRecord {
    return DocumentBatchRecord.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DocumentBatchRecord>): DocumentBatchRecord {
    const message = createBaseDocumentBatchRecord();
    message.data = (object.data !== undefined && object.data !== null)
      ? DocuSumDocumentBatch.fromPartial(object.data)
      : undefined;
    message.allowedActions = object.allowedActions?.map((e) => e) || [];
    message.docs = object.docs?.map((e) => DocumentRecord.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDocumentRecord(): DocumentRecord {
  return { data: undefined, allowedActions: [] };
}

export const DocumentRecord = {
  encode(message: DocumentRecord, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.data !== undefined) {
      DocuSumDocument.encode(message.data, writer.uint32(10).fork()).ldelim();
    }
    writer.uint32(18).fork();
    for (const v of message.allowedActions) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DocumentRecord {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDocumentRecord();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.data = DocuSumDocument.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag === 16) {
            message.allowedActions.push(reader.int32() as any);

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.allowedActions.push(reader.int32() as any);
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DocumentRecord {
    return {
      data: isSet(object.data) ? DocuSumDocument.fromJSON(object.data) : undefined,
      allowedActions: globalThis.Array.isArray(object?.allowedActions)
        ? object.allowedActions.map((e: any) => documentRecord_ActionFromJSON(e))
        : [],
    };
  },

  toJSON(message: DocumentRecord): unknown {
    const obj: any = {};
    if (message.data !== undefined) {
      obj.data = DocuSumDocument.toJSON(message.data);
    }
    if (message.allowedActions?.length) {
      obj.allowedActions = message.allowedActions.map((e) => documentRecord_ActionToJSON(e));
    }
    return obj;
  },

  create(base?: DeepPartial<DocumentRecord>): DocumentRecord {
    return DocumentRecord.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DocumentRecord>): DocumentRecord {
    const message = createBaseDocumentRecord();
    message.data = (object.data !== undefined && object.data !== null)
      ? DocuSumDocument.fromPartial(object.data)
      : undefined;
    message.allowedActions = object.allowedActions?.map((e) => e) || [];
    return message;
  },
};

function createBaseListDocumentBatchResponse(): ListDocumentBatchResponse {
  return { error: undefined, report: undefined, batch: undefined };
}

export const ListDocumentBatchResponse = {
  encode(message: ListDocumentBatchResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    if (message.report !== undefined) {
      ListDocumentBatchResponse_Report.encode(message.report, writer.uint32(18).fork()).ldelim();
    }
    if (message.batch !== undefined) {
      DocumentBatchRecord.encode(message.batch, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListDocumentBatchResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListDocumentBatchResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.report = ListDocumentBatchResponse_Report.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.batch = DocumentBatchRecord.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListDocumentBatchResponse {
    return {
      error: isSet(object.error) ? Error.fromJSON(object.error) : undefined,
      report: isSet(object.report) ? ListDocumentBatchResponse_Report.fromJSON(object.report) : undefined,
      batch: isSet(object.batch) ? DocumentBatchRecord.fromJSON(object.batch) : undefined,
    };
  },

  toJSON(message: ListDocumentBatchResponse): unknown {
    const obj: any = {};
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    if (message.report !== undefined) {
      obj.report = ListDocumentBatchResponse_Report.toJSON(message.report);
    }
    if (message.batch !== undefined) {
      obj.batch = DocumentBatchRecord.toJSON(message.batch);
    }
    return obj;
  },

  create(base?: DeepPartial<ListDocumentBatchResponse>): ListDocumentBatchResponse {
    return ListDocumentBatchResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListDocumentBatchResponse>): ListDocumentBatchResponse {
    const message = createBaseListDocumentBatchResponse();
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    message.report = (object.report !== undefined && object.report !== null)
      ? ListDocumentBatchResponse_Report.fromPartial(object.report)
      : undefined;
    message.batch = (object.batch !== undefined && object.batch !== null)
      ? DocumentBatchRecord.fromPartial(object.batch)
      : undefined;
    return message;
  },
};

function createBaseListDocumentBatchResponse_Report(): ListDocumentBatchResponse_Report {
  return { total: 0 };
}

export const ListDocumentBatchResponse_Report = {
  encode(message: ListDocumentBatchResponse_Report, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.total !== 0) {
      writer.uint32(8).int64(message.total);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListDocumentBatchResponse_Report {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListDocumentBatchResponse_Report();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.total = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListDocumentBatchResponse_Report {
    return { total: isSet(object.total) ? globalThis.Number(object.total) : 0 };
  },

  toJSON(message: ListDocumentBatchResponse_Report): unknown {
    const obj: any = {};
    if (message.total !== 0) {
      obj.total = Math.round(message.total);
    }
    return obj;
  },

  create(base?: DeepPartial<ListDocumentBatchResponse_Report>): ListDocumentBatchResponse_Report {
    return ListDocumentBatchResponse_Report.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListDocumentBatchResponse_Report>): ListDocumentBatchResponse_Report {
    const message = createBaseListDocumentBatchResponse_Report();
    message.total = object.total ?? 0;
    return message;
  },
};

function createBaseOrganizeDocumentBatchRequest(): OrganizeDocumentBatchRequest {
  return { platformId: 0, userId: 0, requesterId: "", batchId: "", version: 0, groups: [] };
}

export const OrganizeDocumentBatchRequest = {
  encode(message: OrganizeDocumentBatchRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platformId !== 0) {
      writer.uint32(8).int64(message.platformId);
    }
    if (message.userId !== 0) {
      writer.uint32(16).int64(message.userId);
    }
    if (message.requesterId !== "") {
      writer.uint32(26).string(message.requesterId);
    }
    if (message.batchId !== "") {
      writer.uint32(34).string(message.batchId);
    }
    if (message.version !== 0) {
      writer.uint32(40).int64(message.version);
    }
    for (const v of message.groups) {
      OrganizeDocumentBatchRequest_Group.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OrganizeDocumentBatchRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOrganizeDocumentBatchRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.platformId = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.userId = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.requesterId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.batchId = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.version = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.groups.push(OrganizeDocumentBatchRequest_Group.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OrganizeDocumentBatchRequest {
    return {
      platformId: isSet(object.platformId) ? globalThis.Number(object.platformId) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      requesterId: isSet(object.requesterId) ? globalThis.String(object.requesterId) : "",
      batchId: isSet(object.batchId) ? globalThis.String(object.batchId) : "",
      version: isSet(object.version) ? globalThis.Number(object.version) : 0,
      groups: globalThis.Array.isArray(object?.groups)
        ? object.groups.map((e: any) => OrganizeDocumentBatchRequest_Group.fromJSON(e))
        : [],
    };
  },

  toJSON(message: OrganizeDocumentBatchRequest): unknown {
    const obj: any = {};
    if (message.platformId !== 0) {
      obj.platformId = Math.round(message.platformId);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.requesterId !== "") {
      obj.requesterId = message.requesterId;
    }
    if (message.batchId !== "") {
      obj.batchId = message.batchId;
    }
    if (message.version !== 0) {
      obj.version = Math.round(message.version);
    }
    if (message.groups?.length) {
      obj.groups = message.groups.map((e) => OrganizeDocumentBatchRequest_Group.toJSON(e));
    }
    return obj;
  },

  create(base?: DeepPartial<OrganizeDocumentBatchRequest>): OrganizeDocumentBatchRequest {
    return OrganizeDocumentBatchRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<OrganizeDocumentBatchRequest>): OrganizeDocumentBatchRequest {
    const message = createBaseOrganizeDocumentBatchRequest();
    message.platformId = object.platformId ?? 0;
    message.userId = object.userId ?? 0;
    message.requesterId = object.requesterId ?? "";
    message.batchId = object.batchId ?? "";
    message.version = object.version ?? 0;
    message.groups = object.groups?.map((e) => OrganizeDocumentBatchRequest_Group.fromPartial(e)) || [];
    return message;
  },
};

function createBaseOrganizeDocumentBatchRequest_Group(): OrganizeDocumentBatchRequest_Group {
  return { id: "", documentIds: [] };
}

export const OrganizeDocumentBatchRequest_Group = {
  encode(message: OrganizeDocumentBatchRequest_Group, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    for (const v of message.documentIds) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OrganizeDocumentBatchRequest_Group {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOrganizeDocumentBatchRequest_Group();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.documentIds.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OrganizeDocumentBatchRequest_Group {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      documentIds: globalThis.Array.isArray(object?.documentIds)
        ? object.documentIds.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: OrganizeDocumentBatchRequest_Group): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.documentIds?.length) {
      obj.documentIds = message.documentIds;
    }
    return obj;
  },

  create(base?: DeepPartial<OrganizeDocumentBatchRequest_Group>): OrganizeDocumentBatchRequest_Group {
    return OrganizeDocumentBatchRequest_Group.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<OrganizeDocumentBatchRequest_Group>): OrganizeDocumentBatchRequest_Group {
    const message = createBaseOrganizeDocumentBatchRequest_Group();
    message.id = object.id ?? "";
    message.documentIds = object.documentIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseOrganizeDocumentBatchResponse(): OrganizeDocumentBatchResponse {
  return { error: undefined, batch: undefined };
}

export const OrganizeDocumentBatchResponse = {
  encode(message: OrganizeDocumentBatchResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    if (message.batch !== undefined) {
      DocumentBatchRecord.encode(message.batch, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OrganizeDocumentBatchResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOrganizeDocumentBatchResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.batch = DocumentBatchRecord.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OrganizeDocumentBatchResponse {
    return {
      error: isSet(object.error) ? Error.fromJSON(object.error) : undefined,
      batch: isSet(object.batch) ? DocumentBatchRecord.fromJSON(object.batch) : undefined,
    };
  },

  toJSON(message: OrganizeDocumentBatchResponse): unknown {
    const obj: any = {};
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    if (message.batch !== undefined) {
      obj.batch = DocumentBatchRecord.toJSON(message.batch);
    }
    return obj;
  },

  create(base?: DeepPartial<OrganizeDocumentBatchResponse>): OrganizeDocumentBatchResponse {
    return OrganizeDocumentBatchResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<OrganizeDocumentBatchResponse>): OrganizeDocumentBatchResponse {
    const message = createBaseOrganizeDocumentBatchResponse();
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    message.batch = (object.batch !== undefined && object.batch !== null)
      ? DocumentBatchRecord.fromPartial(object.batch)
      : undefined;
    return message;
  },
};

function createBaseUploadDocumentRequest(): UploadDocumentRequest {
  return { platformId: 0, userId: 0, requesterId: "", batchId: "", version: 0, fileName: "", file: new Uint8Array(0) };
}

export const UploadDocumentRequest = {
  encode(message: UploadDocumentRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platformId !== 0) {
      writer.uint32(8).int64(message.platformId);
    }
    if (message.userId !== 0) {
      writer.uint32(16).int64(message.userId);
    }
    if (message.requesterId !== "") {
      writer.uint32(26).string(message.requesterId);
    }
    if (message.batchId !== "") {
      writer.uint32(34).string(message.batchId);
    }
    if (message.version !== 0) {
      writer.uint32(40).int64(message.version);
    }
    if (message.fileName !== "") {
      writer.uint32(50).string(message.fileName);
    }
    if (message.file.length !== 0) {
      writer.uint32(58).bytes(message.file);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UploadDocumentRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUploadDocumentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.platformId = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.userId = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.requesterId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.batchId = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.version = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.fileName = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.file = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UploadDocumentRequest {
    return {
      platformId: isSet(object.platformId) ? globalThis.Number(object.platformId) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      requesterId: isSet(object.requesterId) ? globalThis.String(object.requesterId) : "",
      batchId: isSet(object.batchId) ? globalThis.String(object.batchId) : "",
      version: isSet(object.version) ? globalThis.Number(object.version) : 0,
      fileName: isSet(object.fileName) ? globalThis.String(object.fileName) : "",
      file: isSet(object.file) ? bytesFromBase64(object.file) : new Uint8Array(0),
    };
  },

  toJSON(message: UploadDocumentRequest): unknown {
    const obj: any = {};
    if (message.platformId !== 0) {
      obj.platformId = Math.round(message.platformId);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.requesterId !== "") {
      obj.requesterId = message.requesterId;
    }
    if (message.batchId !== "") {
      obj.batchId = message.batchId;
    }
    if (message.version !== 0) {
      obj.version = Math.round(message.version);
    }
    if (message.fileName !== "") {
      obj.fileName = message.fileName;
    }
    if (message.file.length !== 0) {
      obj.file = base64FromBytes(message.file);
    }
    return obj;
  },

  create(base?: DeepPartial<UploadDocumentRequest>): UploadDocumentRequest {
    return UploadDocumentRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<UploadDocumentRequest>): UploadDocumentRequest {
    const message = createBaseUploadDocumentRequest();
    message.platformId = object.platformId ?? 0;
    message.userId = object.userId ?? 0;
    message.requesterId = object.requesterId ?? "";
    message.batchId = object.batchId ?? "";
    message.version = object.version ?? 0;
    message.fileName = object.fileName ?? "";
    message.file = object.file ?? new Uint8Array(0);
    return message;
  },
};

function createBaseUploadDocumentResponse(): UploadDocumentResponse {
  return { error: undefined, doc: undefined };
}

export const UploadDocumentResponse = {
  encode(message: UploadDocumentResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    if (message.doc !== undefined) {
      DocuSumDocument.encode(message.doc, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UploadDocumentResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUploadDocumentResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.doc = DocuSumDocument.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UploadDocumentResponse {
    return {
      error: isSet(object.error) ? Error.fromJSON(object.error) : undefined,
      doc: isSet(object.doc) ? DocuSumDocument.fromJSON(object.doc) : undefined,
    };
  },

  toJSON(message: UploadDocumentResponse): unknown {
    const obj: any = {};
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    if (message.doc !== undefined) {
      obj.doc = DocuSumDocument.toJSON(message.doc);
    }
    return obj;
  },

  create(base?: DeepPartial<UploadDocumentResponse>): UploadDocumentResponse {
    return UploadDocumentResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<UploadDocumentResponse>): UploadDocumentResponse {
    const message = createBaseUploadDocumentResponse();
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    message.doc = (object.doc !== undefined && object.doc !== null)
      ? DocuSumDocument.fromPartial(object.doc)
      : undefined;
    return message;
  },
};

function createBaseDeleteDocumentBatchRequest(): DeleteDocumentBatchRequest {
  return { platformId: 0, userId: 0, requesterId: "", batchId: "", version: 0 };
}

export const DeleteDocumentBatchRequest = {
  encode(message: DeleteDocumentBatchRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platformId !== 0) {
      writer.uint32(8).int64(message.platformId);
    }
    if (message.userId !== 0) {
      writer.uint32(16).int64(message.userId);
    }
    if (message.requesterId !== "") {
      writer.uint32(26).string(message.requesterId);
    }
    if (message.batchId !== "") {
      writer.uint32(34).string(message.batchId);
    }
    if (message.version !== 0) {
      writer.uint32(40).int64(message.version);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteDocumentBatchRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteDocumentBatchRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.platformId = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.userId = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.requesterId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.batchId = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.version = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeleteDocumentBatchRequest {
    return {
      platformId: isSet(object.platformId) ? globalThis.Number(object.platformId) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      requesterId: isSet(object.requesterId) ? globalThis.String(object.requesterId) : "",
      batchId: isSet(object.batchId) ? globalThis.String(object.batchId) : "",
      version: isSet(object.version) ? globalThis.Number(object.version) : 0,
    };
  },

  toJSON(message: DeleteDocumentBatchRequest): unknown {
    const obj: any = {};
    if (message.platformId !== 0) {
      obj.platformId = Math.round(message.platformId);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.requesterId !== "") {
      obj.requesterId = message.requesterId;
    }
    if (message.batchId !== "") {
      obj.batchId = message.batchId;
    }
    if (message.version !== 0) {
      obj.version = Math.round(message.version);
    }
    return obj;
  },

  create(base?: DeepPartial<DeleteDocumentBatchRequest>): DeleteDocumentBatchRequest {
    return DeleteDocumentBatchRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DeleteDocumentBatchRequest>): DeleteDocumentBatchRequest {
    const message = createBaseDeleteDocumentBatchRequest();
    message.platformId = object.platformId ?? 0;
    message.userId = object.userId ?? 0;
    message.requesterId = object.requesterId ?? "";
    message.batchId = object.batchId ?? "";
    message.version = object.version ?? 0;
    return message;
  },
};

function createBaseDeleteDocumentBatchResponse(): DeleteDocumentBatchResponse {
  return { error: undefined };
}

export const DeleteDocumentBatchResponse = {
  encode(message: DeleteDocumentBatchResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteDocumentBatchResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteDocumentBatchResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeleteDocumentBatchResponse {
    return { error: isSet(object.error) ? Error.fromJSON(object.error) : undefined };
  },

  toJSON(message: DeleteDocumentBatchResponse): unknown {
    const obj: any = {};
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    return obj;
  },

  create(base?: DeepPartial<DeleteDocumentBatchResponse>): DeleteDocumentBatchResponse {
    return DeleteDocumentBatchResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DeleteDocumentBatchResponse>): DeleteDocumentBatchResponse {
    const message = createBaseDeleteDocumentBatchResponse();
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    return message;
  },
};

function createBaseRemoveDocumentsRequest(): RemoveDocumentsRequest {
  return { platformId: 0, userId: 0, requesterId: "", batchId: "", batchVersion: 0, documentIds: [] };
}

export const RemoveDocumentsRequest = {
  encode(message: RemoveDocumentsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platformId !== 0) {
      writer.uint32(8).int64(message.platformId);
    }
    if (message.userId !== 0) {
      writer.uint32(16).int64(message.userId);
    }
    if (message.requesterId !== "") {
      writer.uint32(26).string(message.requesterId);
    }
    if (message.batchId !== "") {
      writer.uint32(34).string(message.batchId);
    }
    if (message.batchVersion !== 0) {
      writer.uint32(40).int64(message.batchVersion);
    }
    for (const v of message.documentIds) {
      writer.uint32(50).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveDocumentsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveDocumentsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.platformId = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.userId = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.requesterId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.batchId = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.batchVersion = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.documentIds.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RemoveDocumentsRequest {
    return {
      platformId: isSet(object.platformId) ? globalThis.Number(object.platformId) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      requesterId: isSet(object.requesterId) ? globalThis.String(object.requesterId) : "",
      batchId: isSet(object.batchId) ? globalThis.String(object.batchId) : "",
      batchVersion: isSet(object.batchVersion) ? globalThis.Number(object.batchVersion) : 0,
      documentIds: globalThis.Array.isArray(object?.documentIds)
        ? object.documentIds.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: RemoveDocumentsRequest): unknown {
    const obj: any = {};
    if (message.platformId !== 0) {
      obj.platformId = Math.round(message.platformId);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.requesterId !== "") {
      obj.requesterId = message.requesterId;
    }
    if (message.batchId !== "") {
      obj.batchId = message.batchId;
    }
    if (message.batchVersion !== 0) {
      obj.batchVersion = Math.round(message.batchVersion);
    }
    if (message.documentIds?.length) {
      obj.documentIds = message.documentIds;
    }
    return obj;
  },

  create(base?: DeepPartial<RemoveDocumentsRequest>): RemoveDocumentsRequest {
    return RemoveDocumentsRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<RemoveDocumentsRequest>): RemoveDocumentsRequest {
    const message = createBaseRemoveDocumentsRequest();
    message.platformId = object.platformId ?? 0;
    message.userId = object.userId ?? 0;
    message.requesterId = object.requesterId ?? "";
    message.batchId = object.batchId ?? "";
    message.batchVersion = object.batchVersion ?? 0;
    message.documentIds = object.documentIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseRemoveDocumentsResponse(): RemoveDocumentsResponse {
  return { error: undefined };
}

export const RemoveDocumentsResponse = {
  encode(message: RemoveDocumentsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveDocumentsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveDocumentsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RemoveDocumentsResponse {
    return { error: isSet(object.error) ? Error.fromJSON(object.error) : undefined };
  },

  toJSON(message: RemoveDocumentsResponse): unknown {
    const obj: any = {};
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    return obj;
  },

  create(base?: DeepPartial<RemoveDocumentsResponse>): RemoveDocumentsResponse {
    return RemoveDocumentsResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<RemoveDocumentsResponse>): RemoveDocumentsResponse {
    const message = createBaseRemoveDocumentsResponse();
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    return message;
  },
};

function createBaseConfirmDocumentRequest(): ConfirmDocumentRequest {
  return {
    platformId: 0,
    userId: 0,
    requesterId: "",
    batchId: "",
    id: "",
    version: 0,
    docType: "",
    invoice: undefined,
    packingList: undefined,
    billOfLading: undefined,
    arrivalNotice: undefined,
    proofOfDelivery: undefined,
    warehouseAgingReport: undefined,
    warehouseSummary: undefined,
    airwayBill: undefined,
    customsSummaryNote: undefined,
    billSummary: undefined,
    email: undefined,
  };
}

export const ConfirmDocumentRequest = {
  encode(message: ConfirmDocumentRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platformId !== 0) {
      writer.uint32(8).int64(message.platformId);
    }
    if (message.userId !== 0) {
      writer.uint32(16).int64(message.userId);
    }
    if (message.requesterId !== "") {
      writer.uint32(26).string(message.requesterId);
    }
    if (message.batchId !== "") {
      writer.uint32(34).string(message.batchId);
    }
    if (message.id !== "") {
      writer.uint32(42).string(message.id);
    }
    if (message.version !== 0) {
      writer.uint32(48).int64(message.version);
    }
    if (message.docType !== "") {
      writer.uint32(58).string(message.docType);
    }
    if (message.invoice !== undefined) {
      DocuSumDocumentSummary_Invoice.encode(message.invoice, writer.uint32(66).fork()).ldelim();
    }
    if (message.packingList !== undefined) {
      DocuSumDocumentSummary_PackingList.encode(message.packingList, writer.uint32(74).fork()).ldelim();
    }
    if (message.billOfLading !== undefined) {
      DocuSumDocumentSummary_BillOfLading.encode(message.billOfLading, writer.uint32(82).fork()).ldelim();
    }
    if (message.arrivalNotice !== undefined) {
      DocuSumDocumentSummary_BillOfLading.encode(message.arrivalNotice, writer.uint32(90).fork()).ldelim();
    }
    if (message.proofOfDelivery !== undefined) {
      DocuSumDocumentSummary_ProofOfDelivery.encode(message.proofOfDelivery, writer.uint32(98).fork()).ldelim();
    }
    if (message.warehouseAgingReport !== undefined) {
      DocuSumDocumentSummary_WareHouseSummary.encode(message.warehouseAgingReport, writer.uint32(106).fork()).ldelim();
    }
    if (message.warehouseSummary !== undefined) {
      DocuSumDocumentSummary_WareHouseSummary.encode(message.warehouseSummary, writer.uint32(114).fork()).ldelim();
    }
    if (message.airwayBill !== undefined) {
      DocuSumDocumentSummary_BillOfLading.encode(message.airwayBill, writer.uint32(122).fork()).ldelim();
    }
    if (message.customsSummaryNote !== undefined) {
      DocuSumDocumentSummary_CustomsSummaryNote.encode(message.customsSummaryNote, writer.uint32(130).fork()).ldelim();
    }
    if (message.billSummary !== undefined) {
      DocuSumDocumentSummary_BillSummary.encode(message.billSummary, writer.uint32(138).fork()).ldelim();
    }
    if (message.email !== undefined) {
      DocuSumDocumentSummary_Email.encode(message.email, writer.uint32(146).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConfirmDocumentRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmDocumentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.platformId = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.userId = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.requesterId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.batchId = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.id = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.version = longToNumber(reader.int64() as Long);
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.docType = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.invoice = DocuSumDocumentSummary_Invoice.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.packingList = DocuSumDocumentSummary_PackingList.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.billOfLading = DocuSumDocumentSummary_BillOfLading.decode(reader, reader.uint32());
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.arrivalNotice = DocuSumDocumentSummary_BillOfLading.decode(reader, reader.uint32());
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.proofOfDelivery = DocuSumDocumentSummary_ProofOfDelivery.decode(reader, reader.uint32());
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.warehouseAgingReport = DocuSumDocumentSummary_WareHouseSummary.decode(reader, reader.uint32());
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.warehouseSummary = DocuSumDocumentSummary_WareHouseSummary.decode(reader, reader.uint32());
          continue;
        case 15:
          if (tag !== 122) {
            break;
          }

          message.airwayBill = DocuSumDocumentSummary_BillOfLading.decode(reader, reader.uint32());
          continue;
        case 16:
          if (tag !== 130) {
            break;
          }

          message.customsSummaryNote = DocuSumDocumentSummary_CustomsSummaryNote.decode(reader, reader.uint32());
          continue;
        case 17:
          if (tag !== 138) {
            break;
          }

          message.billSummary = DocuSumDocumentSummary_BillSummary.decode(reader, reader.uint32());
          continue;
        case 18:
          if (tag !== 146) {
            break;
          }

          message.email = DocuSumDocumentSummary_Email.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConfirmDocumentRequest {
    return {
      platformId: isSet(object.platformId) ? globalThis.Number(object.platformId) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      requesterId: isSet(object.requesterId) ? globalThis.String(object.requesterId) : "",
      batchId: isSet(object.batchId) ? globalThis.String(object.batchId) : "",
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      version: isSet(object.version) ? globalThis.Number(object.version) : 0,
      docType: isSet(object.docType) ? globalThis.String(object.docType) : "",
      invoice: isSet(object.invoice) ? DocuSumDocumentSummary_Invoice.fromJSON(object.invoice) : undefined,
      packingList: isSet(object.packingList)
        ? DocuSumDocumentSummary_PackingList.fromJSON(object.packingList)
        : undefined,
      billOfLading: isSet(object.billOfLading)
        ? DocuSumDocumentSummary_BillOfLading.fromJSON(object.billOfLading)
        : undefined,
      arrivalNotice: isSet(object.arrivalNotice)
        ? DocuSumDocumentSummary_BillOfLading.fromJSON(object.arrivalNotice)
        : undefined,
      proofOfDelivery: isSet(object.proofOfDelivery)
        ? DocuSumDocumentSummary_ProofOfDelivery.fromJSON(object.proofOfDelivery)
        : undefined,
      warehouseAgingReport: isSet(object.warehouseAgingReport)
        ? DocuSumDocumentSummary_WareHouseSummary.fromJSON(object.warehouseAgingReport)
        : undefined,
      warehouseSummary: isSet(object.warehouseSummary)
        ? DocuSumDocumentSummary_WareHouseSummary.fromJSON(object.warehouseSummary)
        : undefined,
      airwayBill: isSet(object.airwayBill)
        ? DocuSumDocumentSummary_BillOfLading.fromJSON(object.airwayBill)
        : undefined,
      customsSummaryNote: isSet(object.customsSummaryNote)
        ? DocuSumDocumentSummary_CustomsSummaryNote.fromJSON(object.customsSummaryNote)
        : undefined,
      billSummary: isSet(object.billSummary)
        ? DocuSumDocumentSummary_BillSummary.fromJSON(object.billSummary)
        : undefined,
      email: isSet(object.email) ? DocuSumDocumentSummary_Email.fromJSON(object.email) : undefined,
    };
  },

  toJSON(message: ConfirmDocumentRequest): unknown {
    const obj: any = {};
    if (message.platformId !== 0) {
      obj.platformId = Math.round(message.platformId);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.requesterId !== "") {
      obj.requesterId = message.requesterId;
    }
    if (message.batchId !== "") {
      obj.batchId = message.batchId;
    }
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.version !== 0) {
      obj.version = Math.round(message.version);
    }
    if (message.docType !== "") {
      obj.docType = message.docType;
    }
    if (message.invoice !== undefined) {
      obj.invoice = DocuSumDocumentSummary_Invoice.toJSON(message.invoice);
    }
    if (message.packingList !== undefined) {
      obj.packingList = DocuSumDocumentSummary_PackingList.toJSON(message.packingList);
    }
    if (message.billOfLading !== undefined) {
      obj.billOfLading = DocuSumDocumentSummary_BillOfLading.toJSON(message.billOfLading);
    }
    if (message.arrivalNotice !== undefined) {
      obj.arrivalNotice = DocuSumDocumentSummary_BillOfLading.toJSON(message.arrivalNotice);
    }
    if (message.proofOfDelivery !== undefined) {
      obj.proofOfDelivery = DocuSumDocumentSummary_ProofOfDelivery.toJSON(message.proofOfDelivery);
    }
    if (message.warehouseAgingReport !== undefined) {
      obj.warehouseAgingReport = DocuSumDocumentSummary_WareHouseSummary.toJSON(message.warehouseAgingReport);
    }
    if (message.warehouseSummary !== undefined) {
      obj.warehouseSummary = DocuSumDocumentSummary_WareHouseSummary.toJSON(message.warehouseSummary);
    }
    if (message.airwayBill !== undefined) {
      obj.airwayBill = DocuSumDocumentSummary_BillOfLading.toJSON(message.airwayBill);
    }
    if (message.customsSummaryNote !== undefined) {
      obj.customsSummaryNote = DocuSumDocumentSummary_CustomsSummaryNote.toJSON(message.customsSummaryNote);
    }
    if (message.billSummary !== undefined) {
      obj.billSummary = DocuSumDocumentSummary_BillSummary.toJSON(message.billSummary);
    }
    if (message.email !== undefined) {
      obj.email = DocuSumDocumentSummary_Email.toJSON(message.email);
    }
    return obj;
  },

  create(base?: DeepPartial<ConfirmDocumentRequest>): ConfirmDocumentRequest {
    return ConfirmDocumentRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ConfirmDocumentRequest>): ConfirmDocumentRequest {
    const message = createBaseConfirmDocumentRequest();
    message.platformId = object.platformId ?? 0;
    message.userId = object.userId ?? 0;
    message.requesterId = object.requesterId ?? "";
    message.batchId = object.batchId ?? "";
    message.id = object.id ?? "";
    message.version = object.version ?? 0;
    message.docType = object.docType ?? "";
    message.invoice = (object.invoice !== undefined && object.invoice !== null)
      ? DocuSumDocumentSummary_Invoice.fromPartial(object.invoice)
      : undefined;
    message.packingList = (object.packingList !== undefined && object.packingList !== null)
      ? DocuSumDocumentSummary_PackingList.fromPartial(object.packingList)
      : undefined;
    message.billOfLading = (object.billOfLading !== undefined && object.billOfLading !== null)
      ? DocuSumDocumentSummary_BillOfLading.fromPartial(object.billOfLading)
      : undefined;
    message.arrivalNotice = (object.arrivalNotice !== undefined && object.arrivalNotice !== null)
      ? DocuSumDocumentSummary_BillOfLading.fromPartial(object.arrivalNotice)
      : undefined;
    message.proofOfDelivery = (object.proofOfDelivery !== undefined && object.proofOfDelivery !== null)
      ? DocuSumDocumentSummary_ProofOfDelivery.fromPartial(object.proofOfDelivery)
      : undefined;
    message.warehouseAgingReport = (object.warehouseAgingReport !== undefined && object.warehouseAgingReport !== null)
      ? DocuSumDocumentSummary_WareHouseSummary.fromPartial(object.warehouseAgingReport)
      : undefined;
    message.warehouseSummary = (object.warehouseSummary !== undefined && object.warehouseSummary !== null)
      ? DocuSumDocumentSummary_WareHouseSummary.fromPartial(object.warehouseSummary)
      : undefined;
    message.airwayBill = (object.airwayBill !== undefined && object.airwayBill !== null)
      ? DocuSumDocumentSummary_BillOfLading.fromPartial(object.airwayBill)
      : undefined;
    message.customsSummaryNote = (object.customsSummaryNote !== undefined && object.customsSummaryNote !== null)
      ? DocuSumDocumentSummary_CustomsSummaryNote.fromPartial(object.customsSummaryNote)
      : undefined;
    message.billSummary = (object.billSummary !== undefined && object.billSummary !== null)
      ? DocuSumDocumentSummary_BillSummary.fromPartial(object.billSummary)
      : undefined;
    message.email = (object.email !== undefined && object.email !== null)
      ? DocuSumDocumentSummary_Email.fromPartial(object.email)
      : undefined;
    return message;
  },
};

function createBaseConfirmDocumentResponse(): ConfirmDocumentResponse {
  return { error: undefined, doc: undefined };
}

export const ConfirmDocumentResponse = {
  encode(message: ConfirmDocumentResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    if (message.doc !== undefined) {
      DocuSumDocument.encode(message.doc, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConfirmDocumentResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfirmDocumentResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.doc = DocuSumDocument.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConfirmDocumentResponse {
    return {
      error: isSet(object.error) ? Error.fromJSON(object.error) : undefined,
      doc: isSet(object.doc) ? DocuSumDocument.fromJSON(object.doc) : undefined,
    };
  },

  toJSON(message: ConfirmDocumentResponse): unknown {
    const obj: any = {};
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    if (message.doc !== undefined) {
      obj.doc = DocuSumDocument.toJSON(message.doc);
    }
    return obj;
  },

  create(base?: DeepPartial<ConfirmDocumentResponse>): ConfirmDocumentResponse {
    return ConfirmDocumentResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ConfirmDocumentResponse>): ConfirmDocumentResponse {
    const message = createBaseConfirmDocumentResponse();
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    message.doc = (object.doc !== undefined && object.doc !== null)
      ? DocuSumDocument.fromPartial(object.doc)
      : undefined;
    return message;
  },
};

function createBaseGetDocumentDownloadURLRequest(): GetDocumentDownloadURLRequest {
  return { platformId: 0, userId: 0, requesterId: "", fileId: "", liveTime: 0 };
}

export const GetDocumentDownloadURLRequest = {
  encode(message: GetDocumentDownloadURLRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platformId !== 0) {
      writer.uint32(8).int64(message.platformId);
    }
    if (message.userId !== 0) {
      writer.uint32(16).int64(message.userId);
    }
    if (message.requesterId !== "") {
      writer.uint32(26).string(message.requesterId);
    }
    if (message.fileId !== "") {
      writer.uint32(34).string(message.fileId);
    }
    if (message.liveTime !== 0) {
      writer.uint32(40).int64(message.liveTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDocumentDownloadURLRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDocumentDownloadURLRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.platformId = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.userId = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.requesterId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.fileId = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.liveTime = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetDocumentDownloadURLRequest {
    return {
      platformId: isSet(object.platformId) ? globalThis.Number(object.platformId) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      requesterId: isSet(object.requesterId) ? globalThis.String(object.requesterId) : "",
      fileId: isSet(object.fileId) ? globalThis.String(object.fileId) : "",
      liveTime: isSet(object.liveTime) ? globalThis.Number(object.liveTime) : 0,
    };
  },

  toJSON(message: GetDocumentDownloadURLRequest): unknown {
    const obj: any = {};
    if (message.platformId !== 0) {
      obj.platformId = Math.round(message.platformId);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.requesterId !== "") {
      obj.requesterId = message.requesterId;
    }
    if (message.fileId !== "") {
      obj.fileId = message.fileId;
    }
    if (message.liveTime !== 0) {
      obj.liveTime = Math.round(message.liveTime);
    }
    return obj;
  },

  create(base?: DeepPartial<GetDocumentDownloadURLRequest>): GetDocumentDownloadURLRequest {
    return GetDocumentDownloadURLRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GetDocumentDownloadURLRequest>): GetDocumentDownloadURLRequest {
    const message = createBaseGetDocumentDownloadURLRequest();
    message.platformId = object.platformId ?? 0;
    message.userId = object.userId ?? 0;
    message.requesterId = object.requesterId ?? "";
    message.fileId = object.fileId ?? "";
    message.liveTime = object.liveTime ?? 0;
    return message;
  },
};

function createBaseGetDocumentDownloadURLResponse(): GetDocumentDownloadURLResponse {
  return { error: undefined, url: "" };
}

export const GetDocumentDownloadURLResponse = {
  encode(message: GetDocumentDownloadURLResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    if (message.url !== "") {
      writer.uint32(18).string(message.url);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDocumentDownloadURLResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDocumentDownloadURLResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.url = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetDocumentDownloadURLResponse {
    return {
      error: isSet(object.error) ? Error.fromJSON(object.error) : undefined,
      url: isSet(object.url) ? globalThis.String(object.url) : "",
    };
  },

  toJSON(message: GetDocumentDownloadURLResponse): unknown {
    const obj: any = {};
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    if (message.url !== "") {
      obj.url = message.url;
    }
    return obj;
  },

  create(base?: DeepPartial<GetDocumentDownloadURLResponse>): GetDocumentDownloadURLResponse {
    return GetDocumentDownloadURLResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GetDocumentDownloadURLResponse>): GetDocumentDownloadURLResponse {
    const message = createBaseGetDocumentDownloadURLResponse();
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    message.url = object.url ?? "";
    return message;
  },
};

function createBasePublishDocumentBatchRequest(): PublishDocumentBatchRequest {
  return { platformId: 0, userId: 0, requesterId: "", batchId: "", version: 0 };
}

export const PublishDocumentBatchRequest = {
  encode(message: PublishDocumentBatchRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platformId !== 0) {
      writer.uint32(8).int64(message.platformId);
    }
    if (message.userId !== 0) {
      writer.uint32(16).int64(message.userId);
    }
    if (message.requesterId !== "") {
      writer.uint32(26).string(message.requesterId);
    }
    if (message.batchId !== "") {
      writer.uint32(34).string(message.batchId);
    }
    if (message.version !== 0) {
      writer.uint32(40).int64(message.version);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PublishDocumentBatchRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePublishDocumentBatchRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.platformId = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.userId = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.requesterId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.batchId = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.version = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PublishDocumentBatchRequest {
    return {
      platformId: isSet(object.platformId) ? globalThis.Number(object.platformId) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      requesterId: isSet(object.requesterId) ? globalThis.String(object.requesterId) : "",
      batchId: isSet(object.batchId) ? globalThis.String(object.batchId) : "",
      version: isSet(object.version) ? globalThis.Number(object.version) : 0,
    };
  },

  toJSON(message: PublishDocumentBatchRequest): unknown {
    const obj: any = {};
    if (message.platformId !== 0) {
      obj.platformId = Math.round(message.platformId);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.requesterId !== "") {
      obj.requesterId = message.requesterId;
    }
    if (message.batchId !== "") {
      obj.batchId = message.batchId;
    }
    if (message.version !== 0) {
      obj.version = Math.round(message.version);
    }
    return obj;
  },

  create(base?: DeepPartial<PublishDocumentBatchRequest>): PublishDocumentBatchRequest {
    return PublishDocumentBatchRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<PublishDocumentBatchRequest>): PublishDocumentBatchRequest {
    const message = createBasePublishDocumentBatchRequest();
    message.platformId = object.platformId ?? 0;
    message.userId = object.userId ?? 0;
    message.requesterId = object.requesterId ?? "";
    message.batchId = object.batchId ?? "";
    message.version = object.version ?? 0;
    return message;
  },
};

function createBasePublishDocumentBatchResponse(): PublishDocumentBatchResponse {
  return { error: undefined };
}

export const PublishDocumentBatchResponse = {
  encode(message: PublishDocumentBatchResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PublishDocumentBatchResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePublishDocumentBatchResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PublishDocumentBatchResponse {
    return { error: isSet(object.error) ? Error.fromJSON(object.error) : undefined };
  },

  toJSON(message: PublishDocumentBatchResponse): unknown {
    const obj: any = {};
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    return obj;
  },

  create(base?: DeepPartial<PublishDocumentBatchResponse>): PublishDocumentBatchResponse {
    return PublishDocumentBatchResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<PublishDocumentBatchResponse>): PublishDocumentBatchResponse {
    const message = createBasePublishDocumentBatchResponse();
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    return message;
  },
};

function createBaseExtractDocumentRequest(): ExtractDocumentRequest {
  return { requestId: "", fileName: "", file: new Uint8Array(0), metadata: "" };
}

export const ExtractDocumentRequest = {
  encode(message: ExtractDocumentRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.requestId !== "") {
      writer.uint32(10).string(message.requestId);
    }
    if (message.fileName !== "") {
      writer.uint32(18).string(message.fileName);
    }
    if (message.file.length !== 0) {
      writer.uint32(26).bytes(message.file);
    }
    if (message.metadata !== "") {
      writer.uint32(34).string(message.metadata);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExtractDocumentRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExtractDocumentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.requestId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.fileName = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.file = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.metadata = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ExtractDocumentRequest {
    return {
      requestId: isSet(object.requestId) ? globalThis.String(object.requestId) : "",
      fileName: isSet(object.fileName) ? globalThis.String(object.fileName) : "",
      file: isSet(object.file) ? bytesFromBase64(object.file) : new Uint8Array(0),
      metadata: isSet(object.metadata) ? globalThis.String(object.metadata) : "",
    };
  },

  toJSON(message: ExtractDocumentRequest): unknown {
    const obj: any = {};
    if (message.requestId !== "") {
      obj.requestId = message.requestId;
    }
    if (message.fileName !== "") {
      obj.fileName = message.fileName;
    }
    if (message.file.length !== 0) {
      obj.file = base64FromBytes(message.file);
    }
    if (message.metadata !== "") {
      obj.metadata = message.metadata;
    }
    return obj;
  },

  create(base?: DeepPartial<ExtractDocumentRequest>): ExtractDocumentRequest {
    return ExtractDocumentRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ExtractDocumentRequest>): ExtractDocumentRequest {
    const message = createBaseExtractDocumentRequest();
    message.requestId = object.requestId ?? "";
    message.fileName = object.fileName ?? "";
    message.file = object.file ?? new Uint8Array(0);
    message.metadata = object.metadata ?? "";
    return message;
  },
};

function createBaseExtractDocumentResponse(): ExtractDocumentResponse {
  return { error: undefined, extraction: undefined };
}

export const ExtractDocumentResponse = {
  encode(message: ExtractDocumentResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    if (message.extraction !== undefined) {
      DocumentExtractionRecord.encode(message.extraction, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExtractDocumentResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExtractDocumentResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.extraction = DocumentExtractionRecord.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ExtractDocumentResponse {
    return {
      error: isSet(object.error) ? Error.fromJSON(object.error) : undefined,
      extraction: isSet(object.extraction) ? DocumentExtractionRecord.fromJSON(object.extraction) : undefined,
    };
  },

  toJSON(message: ExtractDocumentResponse): unknown {
    const obj: any = {};
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    if (message.extraction !== undefined) {
      obj.extraction = DocumentExtractionRecord.toJSON(message.extraction);
    }
    return obj;
  },

  create(base?: DeepPartial<ExtractDocumentResponse>): ExtractDocumentResponse {
    return ExtractDocumentResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ExtractDocumentResponse>): ExtractDocumentResponse {
    const message = createBaseExtractDocumentResponse();
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    message.extraction = (object.extraction !== undefined && object.extraction !== null)
      ? DocumentExtractionRecord.fromPartial(object.extraction)
      : undefined;
    return message;
  },
};

function createBaseDocumentExtractionRecord(): DocumentExtractionRecord {
  return {
    data: undefined,
    reference: undefined,
    allowedAdminActions: [],
    hilGcsDestination: "",
    docInfoAllowActions: [],
  };
}

export const DocumentExtractionRecord = {
  encode(message: DocumentExtractionRecord, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.data !== undefined) {
      DocuSumDocumentExtraction.encode(message.data, writer.uint32(10).fork()).ldelim();
    }
    if (message.reference !== undefined) {
      DocuSumDocumentExtraction.encode(message.reference, writer.uint32(42).fork()).ldelim();
    }
    writer.uint32(18).fork();
    for (const v of message.allowedAdminActions) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.hilGcsDestination !== "") {
      writer.uint32(26).string(message.hilGcsDestination);
    }
    for (const v of message.docInfoAllowActions) {
      DocumentExtractionRecord_DocInfoAllowAction.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DocumentExtractionRecord {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDocumentExtractionRecord();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.data = DocuSumDocumentExtraction.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.reference = DocuSumDocumentExtraction.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag === 16) {
            message.allowedAdminActions.push(reader.int32() as any);

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.allowedAdminActions.push(reader.int32() as any);
            }

            continue;
          }

          break;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.hilGcsDestination = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.docInfoAllowActions.push(DocumentExtractionRecord_DocInfoAllowAction.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DocumentExtractionRecord {
    return {
      data: isSet(object.data) ? DocuSumDocumentExtraction.fromJSON(object.data) : undefined,
      reference: isSet(object.reference) ? DocuSumDocumentExtraction.fromJSON(object.reference) : undefined,
      allowedAdminActions: globalThis.Array.isArray(object?.allowedAdminActions)
        ? object.allowedAdminActions.map((e: any) => documentExtractionRecord_AdminActionFromJSON(e))
        : [],
      hilGcsDestination: isSet(object.hilGcsDestination) ? globalThis.String(object.hilGcsDestination) : "",
      docInfoAllowActions: globalThis.Array.isArray(object?.docInfoAllowActions)
        ? object.docInfoAllowActions.map((e: any) => DocumentExtractionRecord_DocInfoAllowAction.fromJSON(e))
        : [],
    };
  },

  toJSON(message: DocumentExtractionRecord): unknown {
    const obj: any = {};
    if (message.data !== undefined) {
      obj.data = DocuSumDocumentExtraction.toJSON(message.data);
    }
    if (message.reference !== undefined) {
      obj.reference = DocuSumDocumentExtraction.toJSON(message.reference);
    }
    if (message.allowedAdminActions?.length) {
      obj.allowedAdminActions = message.allowedAdminActions.map((e) => documentExtractionRecord_AdminActionToJSON(e));
    }
    if (message.hilGcsDestination !== "") {
      obj.hilGcsDestination = message.hilGcsDestination;
    }
    if (message.docInfoAllowActions?.length) {
      obj.docInfoAllowActions = message.docInfoAllowActions.map((e) =>
        DocumentExtractionRecord_DocInfoAllowAction.toJSON(e)
      );
    }
    return obj;
  },

  create(base?: DeepPartial<DocumentExtractionRecord>): DocumentExtractionRecord {
    return DocumentExtractionRecord.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DocumentExtractionRecord>): DocumentExtractionRecord {
    const message = createBaseDocumentExtractionRecord();
    message.data = (object.data !== undefined && object.data !== null)
      ? DocuSumDocumentExtraction.fromPartial(object.data)
      : undefined;
    message.reference = (object.reference !== undefined && object.reference !== null)
      ? DocuSumDocumentExtraction.fromPartial(object.reference)
      : undefined;
    message.allowedAdminActions = object.allowedAdminActions?.map((e) => e) || [];
    message.hilGcsDestination = object.hilGcsDestination ?? "";
    message.docInfoAllowActions =
      object.docInfoAllowActions?.map((e) => DocumentExtractionRecord_DocInfoAllowAction.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDocumentExtractionRecord_DocInfoAllowAction(): DocumentExtractionRecord_DocInfoAllowAction {
  return { docInfoId: "", allowedAdminActions: [] };
}

export const DocumentExtractionRecord_DocInfoAllowAction = {
  encode(message: DocumentExtractionRecord_DocInfoAllowAction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.docInfoId !== "") {
      writer.uint32(10).string(message.docInfoId);
    }
    writer.uint32(18).fork();
    for (const v of message.allowedAdminActions) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DocumentExtractionRecord_DocInfoAllowAction {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDocumentExtractionRecord_DocInfoAllowAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.docInfoId = reader.string();
          continue;
        case 2:
          if (tag === 16) {
            message.allowedAdminActions.push(reader.int32() as any);

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.allowedAdminActions.push(reader.int32() as any);
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DocumentExtractionRecord_DocInfoAllowAction {
    return {
      docInfoId: isSet(object.docInfoId) ? globalThis.String(object.docInfoId) : "",
      allowedAdminActions: globalThis.Array.isArray(object?.allowedAdminActions)
        ? object.allowedAdminActions.map((e: any) => documentExtractionRecord_AdminActionFromJSON(e))
        : [],
    };
  },

  toJSON(message: DocumentExtractionRecord_DocInfoAllowAction): unknown {
    const obj: any = {};
    if (message.docInfoId !== "") {
      obj.docInfoId = message.docInfoId;
    }
    if (message.allowedAdminActions?.length) {
      obj.allowedAdminActions = message.allowedAdminActions.map((e) => documentExtractionRecord_AdminActionToJSON(e));
    }
    return obj;
  },

  create(base?: DeepPartial<DocumentExtractionRecord_DocInfoAllowAction>): DocumentExtractionRecord_DocInfoAllowAction {
    return DocumentExtractionRecord_DocInfoAllowAction.fromPartial(base ?? {});
  },
  fromPartial(
    object: DeepPartial<DocumentExtractionRecord_DocInfoAllowAction>,
  ): DocumentExtractionRecord_DocInfoAllowAction {
    const message = createBaseDocumentExtractionRecord_DocInfoAllowAction();
    message.docInfoId = object.docInfoId ?? "";
    message.allowedAdminActions = object.allowedAdminActions?.map((e) => e) || [];
    return message;
  },
};

function createBaseListDocumentExtractionRequest(): ListDocumentExtractionRequest {
  return {
    platformId: 0,
    userId: 0,
    requesterId: "",
    offset: 0,
    limit: 0,
    includeHilInfo: false,
    ids: [],
    requestIds: [],
  };
}

export const ListDocumentExtractionRequest = {
  encode(message: ListDocumentExtractionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platformId !== 0) {
      writer.uint32(8).int64(message.platformId);
    }
    if (message.userId !== 0) {
      writer.uint32(16).int64(message.userId);
    }
    if (message.requesterId !== "") {
      writer.uint32(26).string(message.requesterId);
    }
    if (message.offset !== 0) {
      writer.uint32(32).int64(message.offset);
    }
    if (message.limit !== 0) {
      writer.uint32(40).int64(message.limit);
    }
    if (message.includeHilInfo === true) {
      writer.uint32(64).bool(message.includeHilInfo);
    }
    for (const v of message.ids) {
      writer.uint32(50).string(v!);
    }
    for (const v of message.requestIds) {
      writer.uint32(58).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListDocumentExtractionRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListDocumentExtractionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.platformId = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.userId = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.requesterId = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.offset = longToNumber(reader.int64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.limit = longToNumber(reader.int64() as Long);
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.includeHilInfo = reader.bool();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.ids.push(reader.string());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.requestIds.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListDocumentExtractionRequest {
    return {
      platformId: isSet(object.platformId) ? globalThis.Number(object.platformId) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      requesterId: isSet(object.requesterId) ? globalThis.String(object.requesterId) : "",
      offset: isSet(object.offset) ? globalThis.Number(object.offset) : 0,
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      includeHilInfo: isSet(object.includeHilInfo) ? globalThis.Boolean(object.includeHilInfo) : false,
      ids: globalThis.Array.isArray(object?.ids) ? object.ids.map((e: any) => globalThis.String(e)) : [],
      requestIds: globalThis.Array.isArray(object?.requestIds)
        ? object.requestIds.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: ListDocumentExtractionRequest): unknown {
    const obj: any = {};
    if (message.platformId !== 0) {
      obj.platformId = Math.round(message.platformId);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.requesterId !== "") {
      obj.requesterId = message.requesterId;
    }
    if (message.offset !== 0) {
      obj.offset = Math.round(message.offset);
    }
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.includeHilInfo === true) {
      obj.includeHilInfo = message.includeHilInfo;
    }
    if (message.ids?.length) {
      obj.ids = message.ids;
    }
    if (message.requestIds?.length) {
      obj.requestIds = message.requestIds;
    }
    return obj;
  },

  create(base?: DeepPartial<ListDocumentExtractionRequest>): ListDocumentExtractionRequest {
    return ListDocumentExtractionRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListDocumentExtractionRequest>): ListDocumentExtractionRequest {
    const message = createBaseListDocumentExtractionRequest();
    message.platformId = object.platformId ?? 0;
    message.userId = object.userId ?? 0;
    message.requesterId = object.requesterId ?? "";
    message.offset = object.offset ?? 0;
    message.limit = object.limit ?? 0;
    message.includeHilInfo = object.includeHilInfo ?? false;
    message.ids = object.ids?.map((e) => e) || [];
    message.requestIds = object.requestIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseListDocumentExtractionResponse(): ListDocumentExtractionResponse {
  return { error: undefined, extraction: undefined };
}

export const ListDocumentExtractionResponse = {
  encode(message: ListDocumentExtractionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    if (message.extraction !== undefined) {
      DocumentExtractionRecord.encode(message.extraction, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListDocumentExtractionResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListDocumentExtractionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.extraction = DocumentExtractionRecord.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListDocumentExtractionResponse {
    return {
      error: isSet(object.error) ? Error.fromJSON(object.error) : undefined,
      extraction: isSet(object.extraction) ? DocumentExtractionRecord.fromJSON(object.extraction) : undefined,
    };
  },

  toJSON(message: ListDocumentExtractionResponse): unknown {
    const obj: any = {};
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    if (message.extraction !== undefined) {
      obj.extraction = DocumentExtractionRecord.toJSON(message.extraction);
    }
    return obj;
  },

  create(base?: DeepPartial<ListDocumentExtractionResponse>): ListDocumentExtractionResponse {
    return ListDocumentExtractionResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListDocumentExtractionResponse>): ListDocumentExtractionResponse {
    const message = createBaseListDocumentExtractionResponse();
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    message.extraction = (object.extraction !== undefined && object.extraction !== null)
      ? DocumentExtractionRecord.fromPartial(object.extraction)
      : undefined;
    return message;
  },
};

function createBaseReviewDocumentExtractionRequest(): ReviewDocumentExtractionRequest {
  return {
    platformId: 0,
    userId: 0,
    requesterId: "",
    id: "",
    version: 0,
    docInfoId: "",
    correctFields: [],
    incorrectFields: [],
  };
}

export const ReviewDocumentExtractionRequest = {
  encode(message: ReviewDocumentExtractionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platformId !== 0) {
      writer.uint32(8).int64(message.platformId);
    }
    if (message.userId !== 0) {
      writer.uint32(16).int64(message.userId);
    }
    if (message.requesterId !== "") {
      writer.uint32(26).string(message.requesterId);
    }
    if (message.id !== "") {
      writer.uint32(34).string(message.id);
    }
    if (message.version !== 0) {
      writer.uint32(40).int64(message.version);
    }
    if (message.docInfoId !== "") {
      writer.uint32(66).string(message.docInfoId);
    }
    for (const v of message.correctFields) {
      writer.uint32(50).string(v!);
    }
    for (const v of message.incorrectFields) {
      writer.uint32(58).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReviewDocumentExtractionRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReviewDocumentExtractionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.platformId = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.userId = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.requesterId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.id = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.version = longToNumber(reader.int64() as Long);
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.docInfoId = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.correctFields.push(reader.string());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.incorrectFields.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ReviewDocumentExtractionRequest {
    return {
      platformId: isSet(object.platformId) ? globalThis.Number(object.platformId) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      requesterId: isSet(object.requesterId) ? globalThis.String(object.requesterId) : "",
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      version: isSet(object.version) ? globalThis.Number(object.version) : 0,
      docInfoId: isSet(object.docInfoId) ? globalThis.String(object.docInfoId) : "",
      correctFields: globalThis.Array.isArray(object?.correctFields)
        ? object.correctFields.map((e: any) => globalThis.String(e))
        : [],
      incorrectFields: globalThis.Array.isArray(object?.incorrectFields)
        ? object.incorrectFields.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: ReviewDocumentExtractionRequest): unknown {
    const obj: any = {};
    if (message.platformId !== 0) {
      obj.platformId = Math.round(message.platformId);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.requesterId !== "") {
      obj.requesterId = message.requesterId;
    }
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.version !== 0) {
      obj.version = Math.round(message.version);
    }
    if (message.docInfoId !== "") {
      obj.docInfoId = message.docInfoId;
    }
    if (message.correctFields?.length) {
      obj.correctFields = message.correctFields;
    }
    if (message.incorrectFields?.length) {
      obj.incorrectFields = message.incorrectFields;
    }
    return obj;
  },

  create(base?: DeepPartial<ReviewDocumentExtractionRequest>): ReviewDocumentExtractionRequest {
    return ReviewDocumentExtractionRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ReviewDocumentExtractionRequest>): ReviewDocumentExtractionRequest {
    const message = createBaseReviewDocumentExtractionRequest();
    message.platformId = object.platformId ?? 0;
    message.userId = object.userId ?? 0;
    message.requesterId = object.requesterId ?? "";
    message.id = object.id ?? "";
    message.version = object.version ?? 0;
    message.docInfoId = object.docInfoId ?? "";
    message.correctFields = object.correctFields?.map((e) => e) || [];
    message.incorrectFields = object.incorrectFields?.map((e) => e) || [];
    return message;
  },
};

function createBaseReviewDocumentExtractionResponse(): ReviewDocumentExtractionResponse {
  return { error: undefined, extraction: undefined };
}

export const ReviewDocumentExtractionResponse = {
  encode(message: ReviewDocumentExtractionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    if (message.extraction !== undefined) {
      DocumentExtractionRecord.encode(message.extraction, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReviewDocumentExtractionResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReviewDocumentExtractionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.extraction = DocumentExtractionRecord.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ReviewDocumentExtractionResponse {
    return {
      error: isSet(object.error) ? Error.fromJSON(object.error) : undefined,
      extraction: isSet(object.extraction) ? DocumentExtractionRecord.fromJSON(object.extraction) : undefined,
    };
  },

  toJSON(message: ReviewDocumentExtractionResponse): unknown {
    const obj: any = {};
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    if (message.extraction !== undefined) {
      obj.extraction = DocumentExtractionRecord.toJSON(message.extraction);
    }
    return obj;
  },

  create(base?: DeepPartial<ReviewDocumentExtractionResponse>): ReviewDocumentExtractionResponse {
    return ReviewDocumentExtractionResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ReviewDocumentExtractionResponse>): ReviewDocumentExtractionResponse {
    const message = createBaseReviewDocumentExtractionResponse();
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    message.extraction = (object.extraction !== undefined && object.extraction !== null)
      ? DocumentExtractionRecord.fromPartial(object.extraction)
      : undefined;
    return message;
  },
};

function createBaseGetDocumentExtractionDownloadURLRequest(): GetDocumentExtractionDownloadURLRequest {
  return { platformId: 0, userId: 0, requesterId: "", id: "", liveTime: 0 };
}

export const GetDocumentExtractionDownloadURLRequest = {
  encode(message: GetDocumentExtractionDownloadURLRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.platformId !== 0) {
      writer.uint32(8).int64(message.platformId);
    }
    if (message.userId !== 0) {
      writer.uint32(16).int64(message.userId);
    }
    if (message.requesterId !== "") {
      writer.uint32(26).string(message.requesterId);
    }
    if (message.id !== "") {
      writer.uint32(34).string(message.id);
    }
    if (message.liveTime !== 0) {
      writer.uint32(40).int64(message.liveTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDocumentExtractionDownloadURLRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDocumentExtractionDownloadURLRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.platformId = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.userId = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.requesterId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.id = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.liveTime = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetDocumentExtractionDownloadURLRequest {
    return {
      platformId: isSet(object.platformId) ? globalThis.Number(object.platformId) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      requesterId: isSet(object.requesterId) ? globalThis.String(object.requesterId) : "",
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      liveTime: isSet(object.liveTime) ? globalThis.Number(object.liveTime) : 0,
    };
  },

  toJSON(message: GetDocumentExtractionDownloadURLRequest): unknown {
    const obj: any = {};
    if (message.platformId !== 0) {
      obj.platformId = Math.round(message.platformId);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.requesterId !== "") {
      obj.requesterId = message.requesterId;
    }
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.liveTime !== 0) {
      obj.liveTime = Math.round(message.liveTime);
    }
    return obj;
  },

  create(base?: DeepPartial<GetDocumentExtractionDownloadURLRequest>): GetDocumentExtractionDownloadURLRequest {
    return GetDocumentExtractionDownloadURLRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GetDocumentExtractionDownloadURLRequest>): GetDocumentExtractionDownloadURLRequest {
    const message = createBaseGetDocumentExtractionDownloadURLRequest();
    message.platformId = object.platformId ?? 0;
    message.userId = object.userId ?? 0;
    message.requesterId = object.requesterId ?? "";
    message.id = object.id ?? "";
    message.liveTime = object.liveTime ?? 0;
    return message;
  },
};

function createBaseGetDocumentExtractionDownloadURLResponse(): GetDocumentExtractionDownloadURLResponse {
  return { error: undefined, url: "" };
}

export const GetDocumentExtractionDownloadURLResponse = {
  encode(message: GetDocumentExtractionDownloadURLResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    if (message.url !== "") {
      writer.uint32(18).string(message.url);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDocumentExtractionDownloadURLResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDocumentExtractionDownloadURLResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.url = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetDocumentExtractionDownloadURLResponse {
    return {
      error: isSet(object.error) ? Error.fromJSON(object.error) : undefined,
      url: isSet(object.url) ? globalThis.String(object.url) : "",
    };
  },

  toJSON(message: GetDocumentExtractionDownloadURLResponse): unknown {
    const obj: any = {};
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    if (message.url !== "") {
      obj.url = message.url;
    }
    return obj;
  },

  create(base?: DeepPartial<GetDocumentExtractionDownloadURLResponse>): GetDocumentExtractionDownloadURLResponse {
    return GetDocumentExtractionDownloadURLResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GetDocumentExtractionDownloadURLResponse>): GetDocumentExtractionDownloadURLResponse {
    const message = createBaseGetDocumentExtractionDownloadURLResponse();
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    message.url = object.url ?? "";
    return message;
  },
};

function createBaseDataPipelineBootUpRequest(): DataPipelineBootUpRequest {
  return { stream: 0, since: 0 };
}

export const DataPipelineBootUpRequest = {
  encode(message: DataPipelineBootUpRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stream !== 0) {
      writer.uint32(8).int32(message.stream);
    }
    if (message.since !== 0) {
      writer.uint32(16).int64(message.since);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DataPipelineBootUpRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDataPipelineBootUpRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.stream = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.since = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DataPipelineBootUpRequest {
    return {
      stream: isSet(object.stream) ? dataPipelineBootUpRequest_StreamFromJSON(object.stream) : 0,
      since: isSet(object.since) ? globalThis.Number(object.since) : 0,
    };
  },

  toJSON(message: DataPipelineBootUpRequest): unknown {
    const obj: any = {};
    if (message.stream !== 0) {
      obj.stream = dataPipelineBootUpRequest_StreamToJSON(message.stream);
    }
    if (message.since !== 0) {
      obj.since = Math.round(message.since);
    }
    return obj;
  },

  create(base?: DeepPartial<DataPipelineBootUpRequest>): DataPipelineBootUpRequest {
    return DataPipelineBootUpRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DataPipelineBootUpRequest>): DataPipelineBootUpRequest {
    const message = createBaseDataPipelineBootUpRequest();
    message.stream = object.stream ?? 0;
    message.since = object.since ?? 0;
    return message;
  },
};

function createBaseDataPipelineBootUpResponse(): DataPipelineBootUpResponse {
  return { error: undefined };
}

export const DataPipelineBootUpResponse = {
  encode(message: DataPipelineBootUpResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DataPipelineBootUpResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDataPipelineBootUpResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DataPipelineBootUpResponse {
    return { error: isSet(object.error) ? Error.fromJSON(object.error) : undefined };
  },

  toJSON(message: DataPipelineBootUpResponse): unknown {
    const obj: any = {};
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    return obj;
  },

  create(base?: DeepPartial<DataPipelineBootUpResponse>): DataPipelineBootUpResponse {
    return DataPipelineBootUpResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DataPipelineBootUpResponse>): DataPipelineBootUpResponse {
    const message = createBaseDataPipelineBootUpResponse();
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    return message;
  },
};

export type DocuSumDefinition = typeof DocuSumDefinition;
export const DocuSumDefinition = {
  name: "DocuSum",
  fullName: "bluex_payment.DocuSum",
  methods: {
    /** Vendor Related Operations */
    createDocumentBatch: {
      name: "CreateDocumentBatch",
      requestType: CreateDocumentBatchRequest,
      requestStream: false,
      responseType: CreateDocumentBatchResponse,
      responseStream: false,
      options: {},
    },
    listDocumentBatch: {
      name: "ListDocumentBatch",
      requestType: ListDocumentBatchRequest,
      requestStream: false,
      responseType: ListDocumentBatchResponse,
      responseStream: true,
      options: {},
    },
    organizeDocumentBatch: {
      name: "OrganizeDocumentBatch",
      requestType: OrganizeDocumentBatchRequest,
      requestStream: false,
      responseType: OrganizeDocumentBatchResponse,
      responseStream: false,
      options: {},
    },
    uploadDocument: {
      name: "UploadDocument",
      requestType: UploadDocumentRequest,
      requestStream: false,
      responseType: UploadDocumentResponse,
      responseStream: false,
      options: {},
    },
    removeDocuments: {
      name: "RemoveDocuments",
      requestType: RemoveDocumentsRequest,
      requestStream: false,
      responseType: RemoveDocumentsResponse,
      responseStream: false,
      options: {},
    },
    confirmDocument: {
      name: "ConfirmDocument",
      requestType: ConfirmDocumentRequest,
      requestStream: false,
      responseType: ConfirmDocumentResponse,
      responseStream: false,
      options: {},
    },
    getDocumentDownloadURL: {
      name: "GetDocumentDownloadURL",
      requestType: GetDocumentDownloadURLRequest,
      requestStream: false,
      responseType: GetDocumentDownloadURLResponse,
      responseStream: false,
      options: {},
    },
    deleteDocumentBatch: {
      name: "DeleteDocumentBatch",
      requestType: DeleteDocumentBatchRequest,
      requestStream: false,
      responseType: DeleteDocumentBatchResponse,
      responseStream: false,
      options: {},
    },
    publishDocumentBatch: {
      name: "PublishDocumentBatch",
      requestType: PublishDocumentBatchRequest,
      requestStream: false,
      responseType: PublishDocumentBatchResponse,
      responseStream: false,
      options: {},
    },
    /** Document Extraction */
    extractDocument: {
      name: "ExtractDocument",
      requestType: ExtractDocumentRequest,
      requestStream: false,
      responseType: ExtractDocumentResponse,
      responseStream: false,
      options: {},
    },
    listDocumentExtraction: {
      name: "ListDocumentExtraction",
      requestType: ListDocumentExtractionRequest,
      requestStream: false,
      responseType: ListDocumentExtractionResponse,
      responseStream: true,
      options: {},
    },
    reviewDocumentExtraction: {
      name: "ReviewDocumentExtraction",
      requestType: ReviewDocumentExtractionRequest,
      requestStream: false,
      responseType: ReviewDocumentExtractionResponse,
      responseStream: false,
      options: {},
    },
    getDocumentExtractionDownloadURL: {
      name: "GetDocumentExtractionDownloadURL",
      requestType: GetDocumentExtractionDownloadURLRequest,
      requestStream: false,
      responseType: GetDocumentExtractionDownloadURLResponse,
      responseStream: false,
      options: {},
    },
    /** Data Pipeline Boot Up */
    dataPipelineBootUp: {
      name: "DataPipelineBootUp",
      requestType: DataPipelineBootUpRequest,
      requestStream: false,
      responseType: DataPipelineBootUpResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface DocuSumServiceImplementation<CallContextExt = {}> {
  /** Vendor Related Operations */
  createDocumentBatch(
    request: CreateDocumentBatchRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<CreateDocumentBatchResponse>>;
  listDocumentBatch(
    request: ListDocumentBatchRequest,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<ListDocumentBatchResponse>>;
  organizeDocumentBatch(
    request: OrganizeDocumentBatchRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<OrganizeDocumentBatchResponse>>;
  uploadDocument(
    request: UploadDocumentRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<UploadDocumentResponse>>;
  removeDocuments(
    request: RemoveDocumentsRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<RemoveDocumentsResponse>>;
  confirmDocument(
    request: ConfirmDocumentRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ConfirmDocumentResponse>>;
  getDocumentDownloadURL(
    request: GetDocumentDownloadURLRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<GetDocumentDownloadURLResponse>>;
  deleteDocumentBatch(
    request: DeleteDocumentBatchRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<DeleteDocumentBatchResponse>>;
  publishDocumentBatch(
    request: PublishDocumentBatchRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<PublishDocumentBatchResponse>>;
  /** Document Extraction */
  extractDocument(
    request: ExtractDocumentRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ExtractDocumentResponse>>;
  listDocumentExtraction(
    request: ListDocumentExtractionRequest,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<ListDocumentExtractionResponse>>;
  reviewDocumentExtraction(
    request: ReviewDocumentExtractionRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ReviewDocumentExtractionResponse>>;
  getDocumentExtractionDownloadURL(
    request: GetDocumentExtractionDownloadURLRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<GetDocumentExtractionDownloadURLResponse>>;
  /** Data Pipeline Boot Up */
  dataPipelineBootUp(
    request: DataPipelineBootUpRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<DataPipelineBootUpResponse>>;
}

export interface DocuSumClient<CallOptionsExt = {}> {
  /** Vendor Related Operations */
  createDocumentBatch(
    request: DeepPartial<CreateDocumentBatchRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<CreateDocumentBatchResponse>;
  listDocumentBatch(
    request: DeepPartial<ListDocumentBatchRequest>,
    options?: CallOptions & CallOptionsExt,
  ): AsyncIterable<ListDocumentBatchResponse>;
  organizeDocumentBatch(
    request: DeepPartial<OrganizeDocumentBatchRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<OrganizeDocumentBatchResponse>;
  uploadDocument(
    request: DeepPartial<UploadDocumentRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<UploadDocumentResponse>;
  removeDocuments(
    request: DeepPartial<RemoveDocumentsRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<RemoveDocumentsResponse>;
  confirmDocument(
    request: DeepPartial<ConfirmDocumentRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ConfirmDocumentResponse>;
  getDocumentDownloadURL(
    request: DeepPartial<GetDocumentDownloadURLRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<GetDocumentDownloadURLResponse>;
  deleteDocumentBatch(
    request: DeepPartial<DeleteDocumentBatchRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<DeleteDocumentBatchResponse>;
  publishDocumentBatch(
    request: DeepPartial<PublishDocumentBatchRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<PublishDocumentBatchResponse>;
  /** Document Extraction */
  extractDocument(
    request: DeepPartial<ExtractDocumentRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ExtractDocumentResponse>;
  listDocumentExtraction(
    request: DeepPartial<ListDocumentExtractionRequest>,
    options?: CallOptions & CallOptionsExt,
  ): AsyncIterable<ListDocumentExtractionResponse>;
  reviewDocumentExtraction(
    request: DeepPartial<ReviewDocumentExtractionRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ReviewDocumentExtractionResponse>;
  getDocumentExtractionDownloadURL(
    request: DeepPartial<GetDocumentExtractionDownloadURLRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<GetDocumentExtractionDownloadURLResponse>;
  /** Data Pipeline Boot Up */
  dataPipelineBootUp(
    request: DeepPartial<DataPipelineBootUpRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<DataPipelineBootUpResponse>;
}

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export type ServerStreamingMethodResult<Response> = { [Symbol.asyncIterator](): AsyncIterator<Response, void> };
