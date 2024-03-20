import { z } from "zod";
import { EBlRequestSchema, EBlRequestAmendSchema } from "./request";

const EBlFormSchema = EBlRequestSchema.omit({
  authentication_id: true,
});

const EBlFormUpdateSchema = EBlFormSchema.extend({
  ebl_id: z.string(),
})

const EBlFormAmendSchema = EBlRequestAmendSchema.omit({
  authentication_id: true,
}).extend({
  ebl_id: z.string(),
})

export {
  EBlFormSchema,
  EBlFormUpdateSchema,
  EBlFormAmendSchema
}
