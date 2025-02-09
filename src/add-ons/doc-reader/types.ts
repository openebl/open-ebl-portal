import { type EBlFormType } from "@/types/ebl";

export type DocExtractionType = {
  readonly createExtraction: (args: { uuid: string; filename: string; content: Buffer }) => Promise<void>;
  readonly getExtraction: (uuid: string) => Promise<{ status: string; ebl?: EBlFormType; error?: string } | null>;
};
