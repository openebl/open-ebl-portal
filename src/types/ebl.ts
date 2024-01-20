import { z } from "zod";

enum Status {
  Draft = "draft",
  InProgress = "inProgress",
  Printed = "printed",
  Completed = "completed",
}

const EBl = z.object({
  number: z.string(),
  status: z.nativeEnum(Status),
  lastUpdated: z.string().datetime(),
});

type EBlType = z.infer<typeof EBl>;

export { EBl, Status };
export type { EBlType };
