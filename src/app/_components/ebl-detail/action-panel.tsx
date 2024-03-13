"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { EBlAllowAction, type EBlRecordType } from "@/types/ebl";
import { ConfirmationDialog, type DialogState } from "@/app/_components/dialogs/confirmation-dialog";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type AppRouter } from "@/server/api/root";

const ActionPanel = ({
  ebl,
}: {
  ebl: EBlRecordType;
}) => {
  const [action, setAction] = useState<EBlAllowAction>(ebl.allow_actions?.[0] ?? EBlAllowAction.UpdateDraft);
  const [note, setNote] = useState<string>("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>("confirm");
  const [isLoading, setLoading] = useState(false);

  const disabled = ebl.allow_actions?.length === 0;
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
      toast.error(`Failed to ${action} eB/L: ` + error.message);
    },
  })
  const transfer = api.ebl.transfer.useMutation(actionHandlerCallback(EBlAllowAction.Transfer));

  const allowActions = {
    [EBlAllowAction.UpdateDraft]: {
      icon: <></>, // TODO: icon
      label: "Update eB/L Draft",
      handler: () => null,
    },
    [EBlAllowAction.Amend]: {
      icon: <AmendIcon className="text-white" />,
      label: "Amend eB/L",
      handler: () => null,
    },
    [EBlAllowAction.AmendmentRequest]: {
      icon: <AmendIcon className="text-white" />,
      label: "Request eB/L amendment",
      handler: () => null,
    },
    [EBlAllowAction.Print]: {
      icon: <PrinterIcon className="text-white" />,
      label: "Print eB/L",
      handler: () => null,
    },
    [EBlAllowAction.Transfer]: {
      icon: <SendIcon className="text-white" />,
      label: "Transfer eB/L",
      handler: (id: string, note: string) => {
        transfer.mutate({ id, note });
      },
    },
    [EBlAllowAction.Return]: {
      icon: <ReturnIcon className="text-white" />,
      label: "Return eB/L",
      handler: () => null,
    },
    [EBlAllowAction.Surrender]: {
      icon: <></>, // TODO: icon
      label: "Surrender eB/L",
      handler: () => null,
    },
    [EBlAllowAction.Accomplish]: {
      icon: <SendIcon className="text-white" />,
      label: "Accomplish eB/L",
      handler: () => null,
    },
    [EBlAllowAction.Delete]: {
      icon: <></>, // TODO: icon
      label: "Delete eB/L",
      handler: () => null,
    },
  };

  const handleDialogConfirmed = () => {
    if (dialogState === "confirm") {
      setDialogState("waiting");
      setLoading(true);
      allowActions[action].handler(ebl.bl.id, note);
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
  const confirmMessag = action === EBlAllowAction.Transfer ? `Are you sure you want to transfer this eB/L to ${nextPlatformName}?` : 'Are you sure you want to accomplish this eB/L?'
  const transferringMessage = !nextPlatformName ? "The eB/L is transferring..." : `The eB/L is transferring to ${nextPlatformName}...`
  const transferredMessage = !nextPlatformName ? "The eB/L has been transferred" : `The eB/L has been transferred to ${nextPlatformName}.`
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
          loading={isLoading}
          onClick={handleClick}
        >
          {allowActions[action]?.icon} {allowActions[action]?.label}
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
            {ebl.allow_actions?.map((act) => {
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
