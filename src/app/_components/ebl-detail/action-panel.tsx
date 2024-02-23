"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import SendIcon from "@/app/_icons/send-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { type EBlRowType } from "@/types/ebl";

const ActionPanel = ({
  ebl,
  disabled,
}: {
  ebl: EBlRowType;
  disabled: boolean;
}) => {
  const [note, setNote] = useState<string>("");
  const router = useRouter();
  const transfer = api.ebl.transfer.useMutation({
    onSuccess: () => {
      router.push("/ebls", { scroll: true });
      router.refresh();
      toast.success("eB/L is transferred successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to transfer eB/L: " + error.message);
    },
  });
  const handleClick = () => {
    transfer.mutate({ id: ebl.id, note });
  };

  return (
    <>
      <div className="flex w-full px-[1.875rem]">
        <Textarea
          placeholder="Leave notes"
          className="h-[7.5rem]"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </div>
      <div className="flex w-full items-center justify-end px-[1.875rem]">
        <Button
          className="flex h-[2.75rem] w-[12.5rem] select-none items-center justify-start gap-2.5 rounded-none rounded-l-md bg-[#F86919] text-white hover:bg-[#FF965C] focus-visible:ring-[#F86919]/30 active:bg-[#D24B00] disabled:border-[1px] disabled:border-[#CAD2E0] disabled:bg-[#F1F0F0] disabled:text-disabled"
          disabled={disabled}
          onClick={handleClick}
        >
          <SendIcon className="text-white" />
          Transfer
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-[2.75rem] w-[2.5rem] select-none items-center justify-center rounded-none rounded-r-md bg-[#F86919] text-white hover:bg-[#FF965C] focus-visible:ring-[#F86919]/30 active:bg-[#D24B00] disabled:border-[1px] disabled:border-[#CAD2E0] disabled:bg-[#F1F0F0] disabled:text-disabled"
            disabled={disabled}
          >
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[15rem] font-header" align="end">
            <DropdownMenuItem onClick={() => console.log(123)}>
              <Button>Another</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default ActionPanel;
