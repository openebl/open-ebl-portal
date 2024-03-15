"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/trpc/react";

import { ConfirmationDialog, type DialogState } from "@/app/_components/dialogs/confirmation-dialog";
import { useGetShipper } from "@/app/_hooks/shippers-filter";
import PaperPlaneIcon from "@/app/_icons/paper-plane-icon";
import SendIcon from "@/app/_icons/send-icon";
import { Button } from "@/components/ui/button";
import { type EBlFormType, EBlRequestSchema, type EBlRequestType, EBlFormSchema } from "@/types/ebl";
import DetailPanel from "./detail-panel";
import PreviewPanel from "./preview-panel";
import type { ImageType } from "@/app/_components/common/props/types";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type AppRouter } from "@/server/api/root";

const MainSection = ({
  ebl,
  images,
}: {
  ebl: EBlFormType;
  images: ImageType[];
}) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>("confirm");
  const [shipper, setShipper] = useState<string>("");
  const getShipper = useGetShipper(shipper);

  const form = useForm<EBlFormType>({
    resolver: zodResolver(EBlFormSchema),
    defaultValues: {
      ...ebl,
    },
  });

  const issue = api.ebl.issue.useMutation({
    onSuccess: () => {
      console.log(`eBL issue successfully.`);
      setDialogState("completed");
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      setDialogOpen(false);
      toast.error(`Failed to issue eBL: ${error.message}`);
      console.error(error);
    },
  });

  const issueEBl = (payload: { isDraft: boolean }) => {
    const body = EBlRequestSchema.omit({ meta_data: true, authentication_id: true }).parse({ ...form.getValues(), draft: payload.isDraft });
    issue.mutate(body);
  };

  const saveDraft = () => {
    setDialogState('waiting');
    setDialogOpen(true);
    issueEBl({ isDraft: true });
  }

  const submitClicked = async () => {
    const r = await form.trigger(undefined, { shouldFocus: true });
    if (!r) {
      console.error(form.formState.errors);
      return;
    }

    setShipper(form.getValues().shipper);
    setDialogOpen(true);
    setDialogState("confirm");
  };

  const handleDialogCanceled = () => {
    setShipper("");
    setDialogOpen(false);
  }
  const handleDialogConfirmed = () => {
    if (dialogState === "confirm") {
      setDialogState('waiting');
      issueEBl({ isDraft: false });
    } else {
      setDialogOpen(false);
      router.push("/ebls", { scroll: true });
      router.refresh();
    }
  };

  return (
    <div className="px-12 py-10 font-content">
      <div className="text-2xl font-bold leading-9 text-main">New eBL</div>

      <div className="mt-[1.875rem] flex h-[53.5rem] flex-col justify-between rounded-lg border border-solid border-border-light bg-white shadow-lg">
        <div className="flex h-[48.125rem] items-stretch">
          <PreviewPanel images={images} />
          <DetailPanel form={form} />
        </div>

        <div className="flex h-[5.25rem] w-full items-center justify-between border-t-[1px] border-[#D9D9D9] px-[1.875rem]">
          <Link href="/ebls">
            <Button variant="outline" size="lg" className="w-[11.25rem]">
              Cancel
            </Button>
          </Link>
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              size="lg"
              className="w-[11.25rem]"
              onClick={saveDraft}
            >
              Save as Draft
            </Button>
            <Button size="lg" className="w-[11.25rem]" onClick={submitClicked}>
              <SendIcon className="mr-1" />
              Issue eBL
            </Button>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={dialogOpen}
        state={dialogState}
        content={{
          confirm: {
            title: "Are you sure you want to issue this eBL?",
            message:
              "Please ensure that the information provided and the parties selected are accurate.",
            confirmButton: "Issue eBL",
          },
          waiting: {
            icon: <PaperPlaneIcon />,
            message:
              !getShipper.item ? "Drafting eBL..." : `Issuing eBL to ${getShipper.item?.label}...`,
          },
          completed: {
            icon: <PaperPlaneIcon />,
            message:
              !getShipper.item
                ? "The eBL has been drafted."
                : `The eBL has been issued to ${getShipper.item?.label}.`,
            confirmButton: "OK",
          },
        }}
        onCancel={handleDialogCanceled}
        onConfirm={handleDialogConfirmed}
      />
    </div>
  );
};

export default MainSection;
