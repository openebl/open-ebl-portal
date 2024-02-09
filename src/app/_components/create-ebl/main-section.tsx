"use client";

import { Button } from "@/components/ui/button";
import UploadView from "./upload-view";
import ProcessingView from "./processing-view";
import DraftView from "./draft-view";
import SendIcon from "@/app/_icons/send-icon";
import { useForm } from "react-hook-form";
import { EBlDraftFormSchema, type EBlDraftFormType } from "@/types/ebl";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useState } from "react";

const MainSection = () => {
  let status = "new";
  status = "draft";

  const submitClicked = () => {
    return;
  };

  const [ebl] = useState<EBlDraftFormType>({
    blNumber: "",
    blType: "hbl-non-negotiable",
    pol: "THBKK",
    pod: "USLAX",
    eta: new Date(),
    shipper: "foxconn",
    consignee: "samsung",
    notes: "",
  });

  const form = useForm<z.infer<typeof EBlDraftFormSchema>>({
    resolver: zodResolver(EBlDraftFormSchema),
    defaultValues: {
      ...ebl,
    },
  });

  const handleSaveDraft = async () => {
    const r = await form.trigger(undefined, { shouldFocus: true });
    console.log(form.getValues(), r);
  };

  return (
    <div className="px-12 py-10 font-content">
      <div className="text-2xl font-bold leading-9 text-main">New eB/L</div>

      <div className="mt-[1.875rem] flex h-[53.5rem] flex-col justify-between rounded-lg border border-solid border-border-light bg-white shadow-lg">
        {status === "new" && <UploadView />}
        {status === "uploading" && <div>Uploading...</div>}
        {status === "processing" && <ProcessingView />}
        {status === "draft" && <DraftView form={form} />}
        <div className="flex h-[5.25rem] w-full items-center justify-between border-t-[1px] border-[#D9D9D9] px-[1.875rem]">
          <Button variant="outline" size="lg" className="w-[11.25rem]">
            Cancel
          </Button>
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              size="lg"
              className="w-[11.25rem]"
              onClick={handleSaveDraft}
            >
              Save as Draft
            </Button>
            <Button size="lg" className="w-[11.25rem]" onClick={submitClicked}>
              <SendIcon className="mr-1" />
              Issue eB/L
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
