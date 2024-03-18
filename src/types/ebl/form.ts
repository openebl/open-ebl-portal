import { type z } from "zod";
import { EBlRequestSchema } from "./request";

const EBlFormSchema = EBlRequestSchema.omit({
  authentication_id: true,
});

type EBlFormType = z.infer<typeof EBlFormSchema>;

export { type EBlFormType, EBlFormSchema }
