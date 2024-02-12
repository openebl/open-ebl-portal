import { add, format, sub } from "date-fns";
import { z } from "zod";

enum Status {
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
  notes: z.string().max(1500),
});

const EBlDraftSchema = z.object({
  id: z.string(),
  blNumber: z.string(),
  status: z.enum(Object.values(Status) as [Status, ...Status[]]).optional(),
  blType: z.union([
    z.literal('hbl-negotiable'),
    z.literal('hbl-non-negotiable')
  ]).optional(),
  pol: z.string().optional(),
  pod: z.string().optional(),
  eta: z.date().optional(),
  shipper: z.string().optional(),
  consignee: z.string().optional(),
  releaseAgent: z.string().optional(),
  notes: z.string().optional(),
})

const EBlDraftListSchema = z.array(EBlDraftSchema);

type EBlType = z.infer<typeof EBlSchema>;
type EBlDraftType = z.infer<typeof EBlDraftSchema>;
type EBlDraftListType = z.infer<typeof EBlDraftListSchema>;

const defaultEBl: EBlDraftType = {
  id: 'new',
  blNumber: "",
  status: Status.Draft,
  blType: "hbl-non-negotiable",
  pol: "THBKK",
  pod: "USLAX",
  eta: add(new Date(), {days: 7}),
  shipper: "foxconn",
  consignee: "samsung",
  notes: "",
}

const eBlIdGenerator = () => (
  `${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${Math.random().toString(36).slice(2, 8)}`
)

export { EBlDraftListSchema, EBlSchema, EBlDraftSchema, Status, defaultEBl, eBlIdGenerator };
export type { EBlDraftListType, EBlType, EBlDraftType };

