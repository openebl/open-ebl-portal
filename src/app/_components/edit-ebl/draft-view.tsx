"use client";

import { type EBlDraftType } from "@/types/ebl";
import { type UseFormReturn } from "react-hook-form";
import DetailPanel from "./detail-panel";
import PreviewPanel from "./preview-panel";

const DraftView = ({form}:{form: UseFormReturn<EBlDraftType>}) => {

  return (
    <div className="flex h-[48.125rem] items-stretch">
      <PreviewPanel images={[]} />
      <DetailPanel form={form} />
    </div>
  );
};

export default DraftView;
