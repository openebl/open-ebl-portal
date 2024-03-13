import { z } from "zod";

enum EBlDocType {
  MasterBillOfLading = "MasterBillOfLading",
  HouseBillOfLading = "HouseBillOfLading",
}

enum EBlFilter {
  ACTION_NEEDED = "action_needed",
  UPCOMING = "upcoming",
  SENT = "sent",
  ARCHIVE = "archive",
}

enum EBlAllowAction {
  UpdateDraft = "UPDATE_DRAFT",
  Amend = "AMEND",
  RequestAmend = "REQUEST_AMEND", // request issuer for eBL amendment, the eBL will be returned to the issuer
  Print = "PRINT", // any role to finish the eBL cycle immediately (even if it's not the stage in the eBL cycle)
  Transfer = "TRANSFER", // issuer to shipper, shipper to consignee
  Return = "RETURN", // return the eBL ownership to previous owner
  Surrender = "SURRENDER", // consignee to release agent
  Accomplish = "ACCOMPLISH", // release agent to finish the eBL cycle
  Delete = "DELETE",
}

const EBlDocTypeSchema = z.enum(Object.keys(EBlDocType) as [keyof typeof EBlDocType]);
const EBlAllowActionTypeSchema = z.nativeEnum(EBlAllowAction);
const BusinessUnitID = z.string();
const Base64EncodedString = z.string();
const NullableString = z.string().nullable();
const MaybeString = z.string().optional(); // optional: the field may not exist
const Timestamp = z.string().refine((value) => {
  // Validate that the string is a valid ISO 8601 date-time format
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value);
}, {
  message: 'Invalid timestamp format. Expected ISO 8601 date-time with Zulu time (UTC).',
});

export {
  EBlDocTypeSchema,
  EBlAllowActionTypeSchema,
  BusinessUnitID,
  Base64EncodedString,
  NullableString,
  MaybeString,
  Timestamp,
  EBlFilter,
  EBlAllowAction,
};
