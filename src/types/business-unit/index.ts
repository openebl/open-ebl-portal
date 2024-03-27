import { z } from 'zod';
import { BusinessUnitID, UNIXTimestampSecond } from '../common';

const BusinessUnitInfoSchema = z.object({
  id: BusinessUnitID,
  version: z.number(),
  application_id: z.string(),
  status: z.string(),
  name: z.string(),
  addresses: z.array(z.string()),
  country: z.string(),
  emails: z.array(z.string()),
  phone_numbers: z.array(z.string()),
  created_at: UNIXTimestampSecond,
  created_by: z.string(),
  updated_at: UNIXTimestampSecond,
  updated_by: z.string(),
});

const AuthenticationSchema = z.object({
  id: z.string(),
  version: z.number(),
  business_unit: BusinessUnitID,
  status: z.string(),
  created_at: UNIXTimestampSecond,
  created_by: z.string(),
  revoked_at: UNIXTimestampSecond,
  revoked_by: z.string(),
  private_key: z.string(),
  certificate: z.string(),
  cert_fingerprint: z.string(),
});

export const BusinessUnitSchema = z.object({
  business_unit: BusinessUnitInfoSchema,
  authentications: z.array(AuthenticationSchema),
});

export type BusinessUnitType = z.infer<typeof BusinessUnitSchema>;
