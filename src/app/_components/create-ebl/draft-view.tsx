"use client";

import { type EBlDraftFormSchema } from "@/types/ebl";
import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";
import DetailPanel from "./detail-panel";
import PreviewPanel from "./preview-panel";

const DraftView = ({form}:{form: UseFormReturn<z.infer<typeof EBlDraftFormSchema>>}) => {

  return (
    <div className="flex h-[48.125rem] items-stretch">
      <PreviewPanel images={[]} />
      <DetailPanel form={form} />
    </div>
  );
};

export default DraftView;
