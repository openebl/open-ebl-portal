import { z } from "zod";

const BusinessInfoSchema = z.object({
  businessRegisteredRegion: z.string().optional(),
  legalBusinessName: z.string().optional(),
  doingBusinessAs: z.string().optional(),
  companyCategory: z.string().optional(),
  companyType: z.string().optional(),
  ein: z.string().optional(),
  taxId: z.string().optional(),
  otiLicenseNo: z.string().optional(),
  usdotLicenseNo: z.string().optional(),
  customBrokerLicenseNo: z.string().optional(),
  companyPhone: z.string().optional(),
  businessEmail: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().regex(/^\d*$/).optional(),
  companyWebsite: z.string().optional(),
});

type BusinessInfoType = z.infer<typeof BusinessInfoSchema>;
type BusinessInfoKeyType = keyof BusinessInfoType;

const BusinessInfoKeys = Object.keys(BusinessInfoSchema.shape) as Array<keyof BusinessInfoType>;

const BusinessInfoTitleMapping: Record<BusinessInfoKeyType, string> = {
  businessRegisteredRegion: "Business Registered Country / Region",
  legalBusinessName: "Legal Business Name",
  doingBusinessAs: "Doing Business As (DBA) / Trade Name",
  companyCategory: "Company Category",
  companyType: "Company Type",
  ein: "EIN",
  taxId: "Tax ID",
  otiLicenseNo: "OTI License No.",
  usdotLicenseNo: "USDOT License No.",
  customBrokerLicenseNo: "Custom Broker License No.",
  companyPhone: "Company Phone",
  businessEmail: "Business Email Address",
  streetAddress: "Street Address",
  city: "City",
  state: "State / Province",
  zip: "Zip / Postal Code",
  companyWebsite: "Company Website",
};

const newBusinessInfo: BusinessInfoType = {
  businessRegisteredRegion: "",
  legalBusinessName: "",
  doingBusinessAs: "",
  companyCategory: "",
  companyType: "",
  ein: "",
  taxId: "",
  otiLicenseNo: "",
  usdotLicenseNo: "",
  customBrokerLicenseNo: "",
  companyPhone: "",
  businessEmail: "",
  streetAddress: "",
  city: "",
  state: "",
  zip: "",
  companyWebsite: "",
}

export { BusinessInfoSchema, BusinessInfoTitleMapping, BusinessInfoKeys, newBusinessInfo };
export type { BusinessInfoType, BusinessInfoKeyType };
