import { z } from "zod";
import { EBlAllowAction, BusinessUnitID, MaybeString, NullableString, Timestamp } from "./common";

// TODO: TBD the journey data structure
export const EBlJourneyRowSchema = z.object({
  action: z.enum(
    Object.values(EBlAllowAction) as [
      EBlAllowAction,
      ...EBlAllowAction[],
    ],
  ),
  note: MaybeString,
  targetPlatform: BusinessUnitID,
  sourcePlatform: BusinessUnitID,
  user: z
    .object({
      name: NullableString,
      email: z.string().email(),
    })
    .optional()
    .nullable(),
  createdAt: Timestamp,
});

export const EBlJourneyRowListSchema = z.array(EBlJourneyRowSchema);
