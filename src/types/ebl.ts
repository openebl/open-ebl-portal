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

type EBlType = z.infer<typeof EBlSchema>;
type EBlListType = z.infer<typeof EBlListSchema>;

export { EBlSchema, EBlListSchema, Status };
export type { EBlType, EBlListType };
