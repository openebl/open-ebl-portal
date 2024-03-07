import type { z } from "zod";
import { EBlFilter, EBlAllowAction } from "./common";
import { EBlRequestSchema } from "./request";
import { EBlRecordSchema, EBlRecordListSchema, EBlRecordDetailSchema } from "./record";
import { EBlJourneyRowSchema, EBlJourneyRowListSchema } from "./journey";

type EBlRequestType = z.infer<typeof EBlRequestSchema>;
type EBlRecordType = z.infer<typeof EBlRecordSchema>;
type EBlRecordListType = z.infer<typeof EBlRecordListSchema>;
type EBlRecordDetailType = z.infer<typeof EBlRecordDetailSchema>;
// TODO: TBD journey data structure
type EBlJourneyRowType = z.infer<typeof EBlJourneyRowSchema>;
type EBlJourneyRowListType = z.infer<typeof EBlJourneyRowListSchema>;

const eBlIdGenerator = () =>
  `${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8)}`;

export {
  EBlRequestSchema,
  EBlRecordSchema,
  EBlRecordListSchema,
  EBlRecordDetailSchema,
  EBlJourneyRowSchema,
  EBlJourneyRowListSchema,
  eBlIdGenerator,
  EBlFilter,
  EBlAllowAction,
};
export type {
  EBlRequestType,
  EBlRecordType,
  EBlRecordListType,
  EBlRecordDetailType,
  EBlJourneyRowType,
  EBlJourneyRowListType,
};
