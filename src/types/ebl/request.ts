import { z } from "zod";
import { EBlDocTypeSchema, EBlMetadataSchema } from "./common";
import { BusinessUnitID, Base64EncodedString } from "../common";

export const EBlRequestSchema = z.object({
  metadata: EBlMetadataSchema,
  authentication_id: z.string(),
  file: z.object({
    name: z.string(),
    type: z.string(),
    content: Base64EncodedString, // base64 encoded file content
  }),
  bl_number: z.string().trim().min(1).max(50),
  bl_doc_type: EBlDocTypeSchema,
  to_order: z.boolean(), // false: non-negotiable, true: negotiable
  pol: z.object({
    // port of loading
    locationName: z.string(),
    UNLocationCode: z.string(),
  }),
  pod: z.object({
    // port of discharge
    locationName: z.string(),
    UNLocationCode: z.string(),
  }),
  shipper: BusinessUnitID,
  consignee: BusinessUnitID,
  release_agent: BusinessUnitID,
  endorsee: BusinessUnitID.optional().nullable(),
  notify_parties: z.array(BusinessUnitID).optional().nullable(),
  note: z.string().max(1500).optional().nullable(),
  draft: z.boolean(),
});

export const EBlRequestAmendSchema = EBlRequestSchema.omit({
  shipper: true,
  consignee: true,
  release_agent: true,
  draft: true,
});
