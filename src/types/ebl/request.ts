import { z } from "zod";
import { EBlDocTypeSchema, BusinessUnitID, Base64EncodedString, Timestamp } from "./common";

export const EBlRequestSchema = z.object({
  requester: BusinessUnitID,
  authentication_id: z.string(),
  file: z.object({
    name: z.string(),
    type: z.string(),
    content: Base64EncodedString, // base64 encoded file content
  }),
  bl_number: z.string().min(1).max(50),
  bl_doc_type: EBlDocTypeSchema,
  to_order: z.boolean(),
  pol: z.object({ // port of loading
    locationName: z.string(),
    UNLocationCode: z.string(),
  }),
  pod: z.object({ // port of discharge
    locationName: z.string(),
    UNLocationCode: z.string(),
  }),
  eta: Timestamp, // estimated time of arrival
  shipper: BusinessUnitID,
  consignee: BusinessUnitID,
  release_agent: BusinessUnitID,
  note: z.string().max(1500).optional().nullable(),
  draft: z.boolean(),
});
