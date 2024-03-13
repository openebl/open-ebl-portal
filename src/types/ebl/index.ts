import type { z } from "zod";
import { EBlFilter, EBlAllowAction } from "./common";
import { EBlRequestSchema } from "./request";
import { EBlRecordSchema, EBlRecordListSchema } from "./record";

type EBlRequestType = z.infer<typeof EBlRequestSchema>;
type EBlRecordType = z.infer<typeof EBlRecordSchema>;
type EBlRecordListType = z.infer<typeof EBlRecordListSchema>;

const eBlIdGenerator = () =>
  `${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8)}`;

export {
  EBlRequestSchema,
  EBlRecordSchema,
  EBlRecordListSchema,
  eBlIdGenerator,
  EBlFilter,
  EBlAllowAction,
};
export type {
  EBlRequestType,
  EBlRecordType,
  EBlRecordListType,
};
