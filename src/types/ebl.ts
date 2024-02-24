import { EBlJourneyAction } from "@prisma/client";
import { sub } from "date-fns";
import { z } from "zod";

enum Status {
  Uploaded = "UPLOADED",
  Draft = "DRAFT",
  Processing = "PROCESSING",
  Printed = "PRINTED",
  Completed = "COMPLETED",
}

enum EBlAllowAction {
  Issue = "ISSUE",
  Transfer = "TRANSFER",
  Amend = "AMEND",
  Return = "RETURN",
  Accomplish = "ACCOMPLISH",
  Print = "PRINT",
}

const EBlSchema = z.object({
  id: z.string().min(1).max(48),
  blNumber: z.string().min(1).max(50),
  status: z.enum(Object.values(Status) as [Status, ...Status[]]),
  blType: z.union([
    z.literal("hbl-negotiable"),
    z.literal("hbl-non-negotiable"),
  ]),
  pol: z.string().min(1).max(16),
  pod: z.string().min(1).max(16),
  eta: z.date().min(sub(new Date(), { days: 7 })), // yesterday
  shipper: z.string().min(1).max(250),
  consignee: z.string().min(1).max(250),
  releaseAgent: z.string().min(1).max(250),
  notes: z.string().max(1500).optional().nullable(),
});

const EBlDraftSchema = z.object({
  id: z.string(),
  blNumber: z.string(),
  status: z.enum(Object.values(Status) as [Status, ...Status[]]).optional(),
  blType: z
    .union([z.literal("hbl-negotiable"), z.literal("hbl-non-negotiable")])
    .nullable(),
  pol: z.string().optional().nullable(),
  pod: z.string().optional().nullable(),
  eta: z.date().optional().nullable(),
  shipper: z.string().optional().nullable(),
  consignee: z.string().optional().nullable(),
  releaseAgent: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

const EBlRowSchema = EBlDraftSchema.extend({
  issuer: z.string().optional().nullable(),
  ownerPlatform: z.string().optional().nullable(),
  nextPlatform: z.string().optional().nullable(),
  docFilename: z.string().optional().nullable(),
  issuerName: z.string().optional().nullable(),
  shipperName: z.string().optional().nullable(),
  consigneeName: z.string().optional().nullable(),
  releaseAgentName: z.string().optional().nullable(),
  ownerName: z.string().optional().nullable(),
  allowActions: z
    .array(
      z.enum(
        Object.values(EBlAllowAction) as [EBlAllowAction, ...EBlAllowAction[]],
      ),
    )
    .optional(),
  updatedAt: z.date(),
});

const EBlJourneyRowSchema = z.object({
  action: z.enum(
    Object.values(EBlJourneyAction) as [
      EBlJourneyAction,
      ...EBlJourneyAction[],
    ],
  ),
  note: z.string().optional().nullable(),
  targetPlatform: z.string().optional().nullable(),
  sourcePlatform: z.string().optional().nullable(),
  user: z
    .object({
      name: z.string().optional().nullable(),
      email: z.string(),
    })
    .optional()
    .nullable(),
  createdAt: z.date(),
});

const EBlDraftListSchema = z.array(EBlDraftSchema);
const EBlRowSchemaList = z.array(EBlRowSchema);
const EBlJourneyRowListSchema = z.array(EBlJourneyRowSchema);

type EBlType = z.infer<typeof EBlSchema>;
type EBlDraftType = z.infer<typeof EBlDraftSchema>;
type EBlDraftListType = z.infer<typeof EBlDraftListSchema>;
type EBlRowType = z.infer<typeof EBlRowSchema>;
type EBlJourneyRowType = z.infer<typeof EBlJourneyRowSchema>;
type EBlJourneyRowListType = z.infer<typeof EBlJourneyRowListSchema>;

const eBlIdGenerator = () =>
  `${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8)}`;

export {
  EBlDraftListSchema,
  EBlDraftSchema,
  EBlRowSchema,
  EBlRowSchemaList,
  EBlSchema,
  EBlJourneyRowSchema,
  EBlJourneyRowListSchema,
  Status,
  eBlIdGenerator,
  EBlAllowAction,
};
export type {
  EBlDraftListType,
  EBlDraftType,
  EBlRowType,
  EBlType,
  EBlJourneyRowType,
  EBlJourneyRowListType,
};
