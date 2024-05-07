import type { z } from "zod";
import { EBlFilter, EBlMetadataSchema } from "./common";
import { EBlRequestSchema, EBlRequestAmendSchema } from "./request";
import {
  EBlFormSchema,
  EBlFormUpdateSchema,
  EBlFormAmendSchema
} from "./form";
import { type components } from "@/types/bu-scheme";

type EBlRequestType = z.infer<typeof EBlRequestSchema>;
type EBlRequestAmendType = z.infer<typeof EBlRequestAmendSchema>;
type EBlAllowAction = components["schemas"]["BillOfLadingAction"];
type EBlRecordType = components["schemas"]["BillOfLadingRecord"];
type EBlRecordListType = components["schemas"]["ListBillOfLadingRecord"];
type EBlEventType = components["schemas"]["BillOfLadingEvent"];
type EBlMetadataType = z.infer<typeof EBlMetadataSchema>;
type EBlFormType = z.infer<typeof EBlFormSchema>;
type EBlFormUpdateType = z.infer<typeof EBlFormUpdateSchema>;
type EBlFormAmendType = z.infer<typeof EBlFormAmendSchema>;
type EBlFileProcessResultType = {
  uuid: string;
  fileContentBase64: string;
}

const eBlIdGenerator = () =>
  `${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8)}`;

export {
  EBlRequestSchema,
  EBlRequestAmendSchema,
  EBlFormSchema,
  EBlFormUpdateSchema,
  EBlFormAmendSchema,
  EBlMetadataSchema,
  eBlIdGenerator,
  EBlFilter,
};
export type {
  EBlAllowAction,
  EBlRequestType,
  EBlRequestAmendType,
  EBlRecordType,
  EBlRecordListType,
  EBlEventType,
  EBlFormType,
  EBlFormUpdateType,
  EBlFormAmendType,
  EBlMetadataType,
  EBlFileProcessResultType,
};
