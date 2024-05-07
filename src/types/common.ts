import { z } from "zod";

export const BusinessUnitID = z.string();
export const Base64EncodedString = z.string();
export const NullableString = z.string().nullable();
export const MaybeString = z.string().optional(); // optional: the field may not exist
export const ISOTimestamp = z.string().refine((value) => {
  // Validate that the string is a valid ISO 8601 date-time format
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value);
}, {
  message: 'Invalid timestamp format. Expected ISO 8601 date-time with Zulu time (UTC).',
});
export const UNIXTimestampSecond = z.number().refine(timestamp => {
  if (timestamp === 0) return true; // default value of GoLang int64 type

  const digitCount = timestamp.toString().length;
  return digitCount === 10;
}, {
  message: 'Unix timestamp must have 10 digits in second precision'
})
