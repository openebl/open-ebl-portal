"use client";

import CircleInCheckIcon from "@/app/_icons/check-in-circle-icon";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PolicyScrollView } from "./policy-scroll-view";

export type PolicyManifest = {
  title: string;
  content: string;
};

export const PolicyDialog = ({
  manifests,
}: {
  manifests: PolicyManifest[];
}) => {
  const [selected, setSelected] = useState(0);
  const [agreedList, setAgreedList] = useState<number[]>([]);

  const nextUnagreedManifest = (startIndex: number) => {
    for (let i = startIndex + 1; i < manifests.length; i++) {
      if (!agreedList.includes(i)) {
        return i;
      }
    }
    return -1; // Return -1 if all manifests are agreed
  };

  const onPolicySelected = (idx: number) => {
    setSelected(idx);
  };

  const onPolicyAgreed = () => {
    setAgreedList([...agreedList, selected]);
    const nextIdx = nextUnagreedManifest(selected);
    if (nextIdx >= 0) {
      setSelected(nextIdx);
      return;
    }
    const earliestUnagreed = nextUnagreedManifest(-1);
    if (earliestUnagreed >= 0) {
      setSelected(earliestUnagreed);
      return;
    }

    // all policies are agreed
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="max-w-fit font-content">
        <div className="flex h-[50rem] w-[73.75rem]">
          <div className="flex h-full w-[17.5rem] flex-none flex-col bg-background py-12">
            <h3 className="mb-3 px-7 text-base font-semibold text-main">
              BlueX Open eBL Agreements
            </h3>

            {manifests.map((manifest, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex h-10 w-full items-center justify-start px-7 text-[0.8125rem]",
                  idx === selected ? "bg-border-light" : "cursor-pointer",
                )}
                onClick={() => onPolicySelected(idx)}
              >
                {agreedList.includes(idx) ? (
                  <CircleInCheckIcon className="h-6 w-6 text-[#42BE25]" />
                ) : (
                  <CircleInCheckIcon className="h-6 w-6 text-hint" />
                )}

                <p className="ml-[0.625rem]">{manifest.title}</p>
              </div>
            ))}
          </div>

          <PolicyScrollView
            key={selected}
            content={manifests[selected]?.content ?? ""}
            onAgreed={onPolicyAgreed}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
