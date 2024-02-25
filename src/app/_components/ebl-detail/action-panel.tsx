"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isEmpty } from "remeda";
import { toast } from "sonner";

import AmendIcon from "@/app/_icons/amend-icon";
import PaperPlaneIcon from "@/app/_icons/paper-plane-icon";
import PrinterIcon from "@/app/_icons/printer-icon";
import ReturnIcon from "@/app/_icons/return-icon";
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
import { EBlAllowAction, type EBlRowType } from "@/types/ebl";
import {ConfirmationDialog, type DialogState} from "@/app/_components/dialogs/confirmation-dialog";

const availableActions = {
  [EBlAllowAction.Transfer]: {
    icon: <SendIcon className="text-white" />,
    label: "Transfer",
  },
  [EBlAllowAction.Amend]: {
    icon: <AmendIcon className="text-white" />,
    label: "Request Amendment",
  },

  [EBlAllowAction.Return]: {
    icon: <ReturnIcon className="text-white" />,
    label: "Return eB/L",
  },
  [EBlAllowAction.Print]: {
    icon: <PrinterIcon className="text-white" />,
    label: "Print to Paper",
  },
  [EBlAllowAction.Accomplish]: {
    icon: <SendIcon className="text-white" />,
    label: "Accomplish",
  },
  [EBlAllowAction.Issue]: {
    icon: <></>,
    label: "Issue",
  },
};

const ActionPanel = ({
  ebl,
}: {
  ebl: EBlRowType;
}) => {
  const [action, setAction] = useState<EBlAllowAction>(ebl.allowActions?.[0] ?? EBlAllowAction.Transfer);
  const [note, setNote] = useState<string>("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>("confirm");
  // const [confirmOpen, setConfirmOpen] = useState(false);
  // const [transferringOpen, setTransferringOpen] = useState(false);
  // const [transferredOpen, setTransferredOpen] = useState(false);

  const disabled = !ebl.allowActions || isEmpty(ebl.allowActions);
  const router = useRouter();
  const transfer = api.ebl.transfer.useMutation({
    onSuccess: () => {
      setDialogState("completed");
    },
    onError: (error) => {
      setDialogOpen(false);
      console.error(error);
      toast.error("Failed to transfer eB/L: " + error.message);
    },
  });
  const accomplish = api.ebl.accomplish.useMutation({
    onSuccess: () => {
      setDialogState("completed");
    },
    onError: (error) => {
      setDialogOpen(false);
      console.error(error);
      toast.error("Failed to accomplish eB/L: " + error.message);
    },
  });

  const handleDialogConfirmed = () => {
    if (dialogState === "confirm") {
      setDialogState("waiting");
      actionHandlers[action]();
    } else {
      setDialogOpen(false);
      router.push("/ebls", { scroll: true });
      router.refresh();
    }
  }

  const handleClick = () => {
    setDialogOpen(true);
  };

  const actionHandlers = {
    [EBlAllowAction.Issue]: () => {
      null;
    },
    [EBlAllowAction.Transfer]: () => {
      transfer.mutate({ id: ebl.id, note });
    },
    [EBlAllowAction.Amend]: () => {
      null;
    },
    [EBlAllowAction.Return]: () => {
      null;
    },
    [EBlAllowAction.Accomplish]: () => {
      accomplish.mutate({ id: ebl.id, note });
    },
    [EBlAllowAction.Print]: () => {
      null;
    },
  };

  const nextPlatformNameIndex = [ebl.shipper, ebl.consignee, ebl.releaseAgent].indexOf(ebl.nextPlatform)
  const nextPlatformName = nextPlatformNameIndex < 0 ? '' : [ebl.shipperName, ebl.consigneeName, ebl.releaseAgentName][nextPlatformNameIndex]
  const confirmMessag = action === EBlAllowAction.Transfer ? `Are you sure you want to transfer this eB/L to ${nextPlatformName}?` : 'Are you sure you want to accomplish this eB/L?'
  const transferringMessage = !nextPlatformName ? "The eB/L is transferring...":`The eB/L is transferring to ${nextPlatformName}...`
  const transferredMessage = !nextPlatformName ? "The eB/L has been transferred":`The eB/L has been transferred to ${nextPlatformName}.`
  const progressMessage = action === EBlAllowAction.Transfer ? transferringMessage : "The eB/L is accomplishing..."
  const completedMessage = action === EBlAllowAction.Transfer ? transferredMessage : "The eB/L has been accomplished."

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
          className="flex h-[2.75rem] w-[12.5rem] select-none items-center justify-start gap-2.5 rounded-none rounded-l-md bg-[#F86919] px-[1.25rem] text-white hover:bg-[#FF965C] focus-visible:ring-[#F86919]/30 active:bg-[#D24B00] disabled:border-[1px] disabled:border-[#CAD2E0] disabled:bg-[#F1F0F0] disabled:text-disabled"
          disabled={disabled}
          loading={transfer.isLoading || accomplish.isLoading}
          onClick={handleClick}
        >
          {availableActions[action]?.icon} {availableActions[action]?.label}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex h-[2.75rem] w-[2.5rem] select-none items-center justify-center rounded-none rounded-r-md bg-[#F86919] px-0 py-0 text-white hover:bg-[#FF965C] focus-visible:ring-0 active:bg-[#D24B00] disabled:border-[1px] disabled:border-[#CAD2E0] disabled:bg-[#F1F0F0] disabled:text-disabled"
              disabled={disabled}
            >
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[15rem] font-header" align="end">
            {ebl.allowActions?.map((act) => {
              if (act === action) return null;
              const block = availableActions[act];
              return (
                <DropdownMenuItem
                  key={act}
                  className="h-2.75rem flex gap-x-2.5 px-[1rem]"
                  onClick={() => setAction(act)}
                >
                  {block.icon} {block.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmationDialog
        open={dialogOpen}
        state={dialogState}
        content={{
          confirm: {
            title: confirmMessag,
          },
          waiting: {
            icon: <PaperPlaneIcon />,
            message: progressMessage,
          },
          completed: {
            icon: <PaperPlaneIcon />,
            message: completedMessage,
          },
        }}
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleDialogConfirmed}
      />
    </>
  );
};

export default ActionPanel;
