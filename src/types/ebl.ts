import { sub } from "date-fns";
import { z } from "zod";

enum Status {
  Uploaded = "UPLOADED",
  Draft = "DRAFT",
  Processing = "PROCESSING",
  Printed = "PRINTED",
  Completed = "COMPLETED",
}

const EBlSchema = z.object({
  id: z.string().min(1).max(48),
  blNumber: z.string().min(1).max(50),
  status: z.enum(Object.values(Status) as [Status, ...Status[]]),
  blType: z.union([
    z.literal('hbl-negotiable'),
    z.literal('hbl-non-negotiable')
  ]),
  pol: z.string().min(1).max(16),
  pod: z.string().min(1).max(16),
  eta: z.date().min(sub(new Date, {days: 7})), // yesterday
  shipper: z.string().min(1).max(250),
  consignee: z.string().min(1).max(250),
  releaseAgent: z.string().min(1).max(250),
  notes: z.string().max(1500).optional().nullable(),
});

const EBlDraftSchema = z.object({
  id: z.string(),
  blNumber: z.string(),
  status: z.enum(Object.values(Status) as [Status, ...Status[]]).optional(),
  blType: z.union([
    z.literal('hbl-negotiable'),
    z.literal('hbl-non-negotiable')
  ]).nullable(),
  pol: z.string().optional().nullable(),
  pod: z.string().optional().nullable(),
  eta: z.date().optional().nullable(),
  shipper: z.string().optional().nullable(),
  consignee: z.string().optional().nullable(),
  releaseAgent: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

const EBlRowSchema = EBlDraftSchema.extend({
  issuer: z.string().optional().nullable(),
  ownerPlatform: z.string().optional().nullable(),
  nextPlatform: z.string().optional().nullable(),
  updatedAt: z.date(),
});

const EBlDraftListSchema = z.array(EBlDraftSchema);
const EBlRowSchemaList = z.array(EBlRowSchema);

type EBlType = z.infer<typeof EBlSchema>;
type EBlDraftType = z.infer<typeof EBlDraftSchema>;
type EBlDraftListType = z.infer<typeof EBlDraftListSchema>;
type EBlRowType = z.infer<typeof EBlRowSchema>;

const eBlIdGenerator = () => (
  `${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${Math.random().toString(36).slice(2, 8)}`
)

export { EBlDraftListSchema, EBlDraftSchema, EBlRowSchemaList, EBlSchema, Status, eBlIdGenerator };
export type { EBlDraftListType, EBlDraftType, EBlRowType, EBlType };

