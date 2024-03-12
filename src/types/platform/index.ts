export type Platform = {
  name: string;
  country: string;
  legalName: string;
  dba: string; // Doing Business As (DBA) / Trade Name
  category: string; // Company category
  type: string; // Company type
  ein: string; // EIN (Employer Identification Number)
  taxId: string; // Tax ID
  oti: string; // OTI License No.
  usdot: string; // USDOT License No.
  customBroker: string; // Custom Broker License No.
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website: string;
};

export type Platforms = Record<string, Platform>;
