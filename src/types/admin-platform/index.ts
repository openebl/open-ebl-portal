import { z } from "zod";

const PlatformFormSchema = z.object({
  name: z.string().min(1).max(255),
  platformId: z.string().min(1).max(255),
});

type PlatformFormType = z.infer<typeof PlatformFormSchema>;

export { PlatformFormSchema };
export type { PlatformFormType };
