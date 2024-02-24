"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import ConfirmationDialog from "@/app/_components/dialogs/confirmation-dialog";
import ProgressDialog from "@/app/_components/dialogs/progress-dialog";
import SendIcon from "@/app/_icons/send-icon";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { EBlSchema, type EBlDraftType } from "@/types/ebl";
import DetailPanel from "./detail-panel";
import PreviewPanel from "./preview-panel";
import PaperPlaneIcon from "@/app/_icons/paper-plane-icon";
import { useGetShipper } from "@/app/_hooks/shippers-filter";
import NotificationDialog from "../dialogs/notification-dialog";

type ImageType = {
  imageUrl: string;
  thumbnailUrl: string;
  page: number;
};

const MainSection = ({
  ebl,
  images,
}: {
  ebl: EBlDraftType;
  images: ImageType[];
}) => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [issuingOpen, setIssuingOpen] = useState(false);
  const [issedOpen, setIssuedOpen] = useState(false);
  const [shipper, setShipper] = useState<string>("");
  const getShipper = useGetShipper(shipper);
  const saveDraft = api.ebl.saveDraft.useMutation({
    onSuccess: () => {
      router.push("/ebls", { scroll: true });
      router.refresh();
      toast.success("Draft eB/L Saved");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to save draft: " + error.message);
    },
  });

  const issue = api.ebl.issue.useMutation({
    onSuccess: () => {
      // router.push("/ebls", { scroll: true });
      // router.refresh();
      setIssuingOpen(false);
      setIssuedOpen(true);
    },
    onError: (error) => {
      setIssuingOpen(false);
      console.error(error);
      toast.error("Failed to Issue eB/L: " + error.message);
    },
  });

  const form = useForm<EBlDraftType>({
    resolver: zodResolver(EBlSchema),
    defaultValues: {
      ...ebl,
    },
  });

  const handleSaveDraft = async () => {
    saveDraft.mutate({
      ...form.getValues(),
      id: ebl.id,
    });
  };

  const submitClicked = async () => {
    const r = await form.trigger(undefined, { shouldFocus: true });
    if (!r) {
      console.error(form.formState.errors);
      return;
    }

    setShipper(form.getValues().shipper!);
    setConfirmOpen(true);
  };

  const issueEBl = async () => {
    setConfirmOpen(false);
    setIssuingOpen(true);
    issue.mutate({ ...EBlSchema.parse(form.getValues()), id: ebl.id });
  };

  return (
    <div className="px-12 py-10 font-content">
      <div className="text-2xl font-bold leading-9 text-main">New eB/L</div>

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

      <ConfirmationDialog
        open={confirmOpen}
        title="Are you sure you want to issue this eB/L?"
        message="Please ensure that the information provided and the parties selected are accurate."
        confirmTitle="Issue eB/L"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={issueEBl}
      />
      <ProgressDialog
        open={issuingOpen}
        icon={<PaperPlaneIcon />}
        message={
          "The eB/L is issuing " +
          (!getShipper.item ? "" : `to ${getShipper.item?.label}...`)
        }
      />
      <NotificationDialog
        open={issedOpen}
        icon={<PaperPlaneIcon />}
        message={
          "The eB/L has been issued " +
          (!getShipper.item ? "" : `to ${getShipper.item?.label}...`)
        }
        onConfirm={() => {
          router.push("/ebls", { scroll: true });
          router.refresh();
        }}
      />
    </div>
  );
};

export default MainSection;
