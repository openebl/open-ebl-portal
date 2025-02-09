"use client";

import CircleInCheckIcon from "@/app/_icons/check-in-circle-icon.svg";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PolicyScrollView } from "./policy-scroll-view";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export type PolicyManifest = {
  service: string;
  name: string;
  version: number;
  content: string;
};

export const PolicyDialog = ({ manifests }: { manifests: PolicyManifest[] }) => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(0);
  const [readList, setReadList] = useState<number[]>([]);
  const [allRead, setAllRead] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const acceptMutation = api.user.acceptAgreements.useMutation({
    onError: (error) => {
      setAccepting(false);
      toast.error(`Failed to send acknowledge: ${error.message}`);
    },
    onSuccess: () => {
      setAccepting(false);
      setOpen(false);
    },
  });

  const onPolicySelected = (idx: number) => {
    setSelected(idx);
  };

  const onPolicyRead = () => {
    const newAgreedList = [...readList, selected];
    setReadList(newAgreedList);

    const nextIdx = nextUnagreedManifest(selected, manifests, newAgreedList);
    if (nextIdx >= 0) {
      setSelected(nextIdx);
      return;
    }
    const earliestUnagreed = nextUnagreedManifest(-1, manifests, newAgreedList);
    if (earliestUnagreed >= 0) {
      setSelected(earliestUnagreed);
      return;
    }

    // all policies are read
    setAllRead(true);
  };

  const onAcceptClick = () => {
    setAccepting(true);
    acceptMutation.mutate(
      manifests.map((m) => ({
        ...m,
        acceptedAt: Date.now(),
      })),
    );
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-fit font-content">
        <div className="flex h-[50rem] w-[73.75rem]">
          <div className="flex h-full w-[17.5rem] flex-none flex-col rounded-l-lg bg-background py-12">
            <h3 className="mb-3 px-7 text-base font-semibold text-main">BlueX Open eBL Agreements</h3>

            {manifests.map((manifest, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex h-10 w-full items-center justify-start px-7 text-[0.8125rem]",
                  idx === selected ? "bg-border-light" : "cursor-pointer",
                )}
                onClick={() => onPolicySelected(idx)}
              >
                {readList.includes(idx) ? (
                  <CircleInCheckIcon className="h-6 w-6 text-[#42BE25]" />
                ) : (
                  <CircleInCheckIcon className="h-6 w-6 text-hint" />
                )}

                <p className="ml-[0.625rem]">{manifest.name}</p>
              </div>
            ))}

            <div className="flex justify-center">
              <Button className="mt-8 w-[13.75rem]" disabled={!allRead} loading={accepting} onClick={onAcceptClick}>
                I agree to all the agreements
              </Button>
            </div>
          </div>

          <PolicyScrollView
            key={selected}
            info={manifests[selected]!}
            wasRead={readList.includes(selected)}
            onRead={onPolicyRead}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const nextUnagreedManifest = (startIndex: number, manifests: PolicyManifest[], readList: number[]) => {
  for (let i = startIndex + 1; i < manifests.length; i++) {
    if (!readList.includes(i)) {
      return i;
    }
  }
  return -1; // Return -1 if all manifests are agreed
};
