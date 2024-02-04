"use client";

import { type EBlDraftFormType } from "@/types/ebl";
import DetailPanel from "./detail-panel";
import PreviewPanel from "./preview-panel";
import { useState } from "react";

const DraftView = () => {
  const [ebl] = useState<EBlDraftFormType>({
    blNumber:"",
    blType: "hbl-non-negotiable",
    pol: "THBKK",
    pod: "USLAX",
    eta: new Date(),
    shipper: "Foxconn",
    consignee: "Samsung",
    notes: "",
  });

  return (
    <div className="flex h-[48.125rem] items-stretch">
      <PreviewPanel images={[]} />
      <DetailPanel ebl={ebl} />
    </div>
  );
};

export default DraftView;
