"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { isEmpty } from "remeda";

import AmendIcon from "@/app/_icons/amend-icon";
import PaperPlaneIcon from "@/app/_icons/paper-plane-icon";
import PrinterIcon from "@/app/_icons/printer-icon";
import ReturnIcon from "@/app/_icons/return-icon";
import SendIcon from "@/app/_icons/send-icon";
import AccomplishIcon from "@/app/_icons/accomplish-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { EBlAllowAction, type EBlRecordType } from "@/types/ebl";
import { ConfirmationDialog, type DialogState } from "@/app/_components/dialogs/confirmation-dialog";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type AppRouter } from "@/server/api/root";

const ActionPanel = ({
  ebl,
}: {
  ebl: EBlRecordType;
}) => {
  const [action, setAction] = useState<EBlAllowAction | null>(ebl.allow_actions?.[0] ?? null);
  const [note, setNote] = useState<string>("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>("confirm");
  const [isLoading, setLoading] = useState(false);

  const disabled = isEmpty(ebl.allow_actions);
  const router = useRouter();

  const actionHandlerCallback = (action: EBlAllowAction) => ({
    onSuccess: () => {
      setDialogState("completed");
      setLoading(false);
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      setDialogOpen(false);
      setLoading(false);
      console.error(error);
      toast.error(`Failed to ${action} eBL: ` + error.message);
    },
  })
  const transfer = api.ebl.transfer.useMutation(actionHandlerCallback(EBlAllowAction.Transfer));

  const allowActions = {
    [EBlAllowAction.UpdateDraft]: {
      icon: <AmendIcon />,
      label: "Update Draft",
      handler: () => null,
    },
    [EBlAllowAction.Amend]: {
      icon: <AmendIcon />,
      label: "Amend",
      handler: () => null,
    },
    [EBlAllowAction.RequestAmend]: {
      icon: <AmendIcon />,
      label: "Request Amendment",
      handler: () => null,
    },
    [EBlAllowAction.Print]: {
      icon: <PrinterIcon />,
      label: "Print to Paper",
      handler: () => null,
    },
    [EBlAllowAction.Transfer]: {
      icon: <SendIcon />,
      label: "Transfer",
      handler: (id: string, note: string) => {
        transfer.mutate({ id, note });
      },
    },
    [EBlAllowAction.Return]: {
      icon: <ReturnIcon />,
      label: "Return eBL to Requestor",
      handler: () => null,
    },
    [EBlAllowAction.Surrender]: {
      icon: <SendIcon />,
      label: "Surrender",
      handler: () => null,
    },
    [EBlAllowAction.Accomplish]: {
      icon: <AccomplishIcon />,
      label: "Accomplish",
      handler: () => null,
    },
    [EBlAllowAction.Delete]: {
      icon: <></>,
      label: "Delete",
      handler: () => null,
    },
  };

  const handleDialogConfirmed = () => {
    if (dialogState === "confirm") {
      setDialogState("waiting");
      setLoading(true);
      action && allowActions[action].handler(ebl.bl.id, note);
    } else {
      setDialogOpen(false);
      router.push("/ebls", { scroll: true });
      router.refresh();
    }
  }

  const handleClick = () => {
    setDialogOpen(true);
  };

  const nextPlatformName = 'nextPlatformName' // TODO
  const confirmMessage = action === EBlAllowAction.Transfer ? `Are you sure you want to transfer this eBL to ${nextPlatformName}?` : 'Are you sure you want to accomplish this eBL?'
  const transferringMessage = !nextPlatformName ? "The eBL is transferring..." : `The eBL is transferring to ${nextPlatformName}...`
  const transferredMessage = !nextPlatformName ? "The eBL has been transferred" : `The eBL has been transferred to ${nextPlatformName}.`
  const progressMessage = action === EBlAllowAction.Transfer ? transferringMessage : "The eBL is accomplishing..."
  const completedMessage = action === EBlAllowAction.Transfer ? transferredMessage : "The eBL has been accomplished."

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
          className="flex h-[2.75rem] select-none items-center justify-start gap-2.5 rounded-none rounded-l-md bg-[#F86919] px-[1.25rem] text-white hover:bg-[#FF965C] focus-visible:ring-[#F86919]/30 active:bg-[#D24B00] disabled:border-[1px] disabled:border-[#CAD2E0] disabled:bg-[#F1F0F0] disabled:text-disabled"
          disabled={disabled}
          loading={isLoading}
          onClick={handleClick}
        >
          {action && allowActions[action]?.icon} {action && allowActions[action]?.label}
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
            {ebl.allow_actions.map((act) => {
              if (act === action) return null;
              const block = allowActions[act];
              return (
                <DropdownMenuItem
                  key={act}
                  className="h-2.75rem flex gap-x-2.5 px-[1rem]"
                  onClick={() => setAction(act)}
                >
                  {block?.icon} {block?.label}
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
            title: confirmMessage,
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
