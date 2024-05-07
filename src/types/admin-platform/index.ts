import { z } from "zod";
import { BusinessInfoSchema } from "../business-info";

const PlatformFormSchema = z.object({
  name: z.string().min(1).max(255),
  platformId: z.string().min(1).max(255),
}).merge(BusinessInfoSchema);

type PlatformFormType = z.infer<typeof PlatformFormSchema>;

export { PlatformFormSchema };
export type { PlatformFormType };
