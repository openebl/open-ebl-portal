"use client";

import SendIcon from "@/app/_icons/send-icon";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { EBlSchema, type EBlDraftType } from "@/types/ebl";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import DetailPanel from "./detail-panel";
import PreviewPanel from "./preview-panel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const saveDraft = api.ebl.saveDraft.useMutation({
    onSuccess: () => {
      router.push("/ebls", {scroll: true});
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
      router.push("/ebls", {scroll: true});
      router.refresh();
      toast.success("eB/L issued successfully");
    },
    onError: (error) => {
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

  const submitClicked = async () => {
    const r = await form.trigger(undefined, { shouldFocus: true });
    if (!r) {
      console.error(form.formState.errors);
      return;
    }

    issue.mutate({
      ...EBlSchema.parse(form.getValues()),
      id: ebl.id,
    });
  };

  const handleSaveDraft = async () => {
    saveDraft.mutate({
      ...form.getValues(),
      id: ebl.id,
    });
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
    </div>
  );
};

export default MainSection;
