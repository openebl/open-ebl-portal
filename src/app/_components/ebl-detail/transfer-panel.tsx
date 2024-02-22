"use client";

import SendIcon from "@/app/_icons/send-icon";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const TransferPanel = () => {
  "use client";
  const router = useRouter();
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

  return (
    <div className="flex w-full items-center justify-end px-[1.875rem]">
      <Button className="flex h-[2.75rem] w-[12.5rem] items-center justify-start gap-2.5">
        <SendIcon className="text-white" />
        Transfer
      </Button>
    </div>
  );
};

export default TransferPanel;
