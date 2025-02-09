import { z } from "zod";
import { MaybeString } from "../common";

enum EBlDocType {
  MasterBillOfLading = "MasterBillOfLading",
  HouseBillOfLading = "HouseBillOfLading",
  HouseNegotiableBillOfLading = "HouseNegotiableBillOfLading",
}

enum EBlFilter {
  ACTION_NEEDED = "action_needed",
  UPCOMING = "upcoming",
  SENT = "sent",
  ARCHIVE = "archive",
}

const EBlDocTypeSchema = z.enum(Object.keys(EBlDocType) as [keyof typeof EBlDocType]);
const EBlMetadataSchema = z.object({
  username: z.string(),
  docHash: MaybeString,
});

export { EBlDocTypeSchema, EBlMetadataSchema, EBlDocType, EBlFilter };
