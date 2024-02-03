import { z } from "zod";

enum Status {
  Draft = "draft",
  InProgress = "inProgress",
  Printed = "printed",
  Completed = "completed",
}

const EBlSchema = z.object({
  number: z.string(),
  status: z.nativeEnum(Status),
  lastUpdated: z.string().datetime(),
});

const EBlListSchema = z.array(EBlSchema);

const eBlDraftFormSchema = z.object({
  blNumber: z.string().min(1).max(50),
  blType: z.union([
    z.literal('hbl-negotiable'),
    z.literal('hbl-non-negotiable')
  ]),
  pol: z.string().min(1).max(16),
  pod: z.string().min(1).max(16),
  // eta: z.date().min(new Date()),
  // shipper: z.string().min(1).max(250),
  // consignee: z.string().min(1).max(250),
  // releaseAgent: z.string().min(1).max(250),
  // notes: z.string().min(1).max(1500),
})

type EBlType = z.infer<typeof EBlSchema>;
type EBlListType = z.infer<typeof EBlListSchema>;

export { EBlListSchema, EBlSchema, Status, eBlDraftFormSchema };
export type { EBlListType, EBlType };

