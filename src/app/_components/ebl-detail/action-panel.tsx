"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { isEmpty } from "remeda";

import AmendIcon from "@/app/_icons/amend-icon";
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
import { type EBlAllowAction, type EBlRecordType } from "@/types/ebl";
import { type DialogState } from "@/app/_components/dialogs/confirmation-dialog";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type AppRouter } from "@/server/api/root";
import { type DialogActionType, EBlConfirmationDialog } from "../dialogs/ebl-confirmation-dialog";
import PrinterWhiteIcon from "@/app/_icons/printer-white-icon";
import { getNextPartyIDByAction } from "@/lib/ebl";

const ActionPanel = ({
  ebl,
}: {
  ebl: EBlRecordType;
}) => {
  const defaultActionList: EBlAllowAction[] = ['TRANSFER', 'SURRENDER', 'ACCOMPLISH']
  const defaultAction = defaultActionList.find(action => ebl.allow_actions?.includes(action)) ?? ebl.allow_actions?.[0];
  const [action, setAction] = useState<EBlAllowAction | undefined>(defaultAction);
  const [note, setNote] = useState<string>("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>("confirm");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const { data: platforms } = api.platform.list.useQuery()
  const nextPartyID = getNextPartyIDByAction(ebl, action!) ?? ""
  const nextPartyName = platforms?.[nextPartyID]?.name ?? ""

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
  const requestAmendEBl = api.ebl.amendment_request.useMutation(actionHandlerCallback("REQUEST_AMEND"));
  const printEBl = api.ebl.print_to_paper.useMutation(actionHandlerCallback("PRINT"));
  const transferEBl = api.ebl.transfer.useMutation(actionHandlerCallback("TRANSFER"));
  const returnEBl = api.ebl.return.useMutation(actionHandlerCallback("RETURN"));
  const surrenderEBl = api.ebl.surrender.useMutation(actionHandlerCallback("SURRENDER"));
  const accomplishEBl = api.ebl.accomplish.useMutation(actionHandlerCallback("ACCOMPLISH"));

  const allowActions: Record<EBlAllowAction, { icon: JSX.Element, label: string, handler: (id: string, note: string) => void }> = {
    "UPDATE_DRAFT": {
      icon: <AmendIcon />,
      label: "Update Draft",
      handler: () => null,
    },
    "AMEND": {
      icon: <AmendIcon />,
      label: "Amend",
      handler: () => null,
    },
    "REQUEST_AMEND": {
      icon: <AmendIcon />,
      label: "Request Amendment",
      handler: (id: string, note: string) => {
        if (note.length === 0) {
          setDialogState("confirm");
          setDialogOpen(false);
          setLoading(false);
          toast.error("Please leave a note.");
          return
        }
        requestAmendEBl.mutate({ id, note });
      },
    },
    "PRINT": {
      icon: action === "PRINT" ? <PrinterWhiteIcon /> : <PrinterIcon />,
      label: "Print to Paper",
      handler: (id: string, note: string) => {
        printEBl.mutate({ id, note });
      },
    },
    "TRANSFER": {
      icon: <SendIcon />,
      label: "Transfer",
      handler: (id: string, note: string) => {
        transferEBl.mutate({ id, note });
      },
    },
    "RETURN": {
      icon: <ReturnIcon />,
      label: "Return eBL to Requestor",
      handler: (id: string, note: string) => {
        returnEBl.mutate({ id, note });
      },
    },
    "SURRENDER": {
      icon: <SendIcon />,
      label: "Surrender",
      handler: (id: string, note: string) => {
        surrenderEBl.mutate({ id, note });
      },
    },
    "ACCOMPLISH": {
      icon: <AccomplishIcon />,
      label: "Accomplish",
      handler: (id: string, note: string) => {
        accomplishEBl.mutate({ id, note });
      },
    },
    "DELETE": {
      icon: <></>,
      label: "Delete",
      handler: () => null,
    },
  };

  const handleDialogCanceled = () => {
    setDialogOpen(false)
  }
  const handleDialogConfirmed = () => {
    if (dialogState === "confirm") {
      setDialogState("waiting");
      setLoading(true);
      action && allowActions[action].handler(ebl.bl?.id ?? "", note);
    } else {
      setDialogOpen(false);
      router.push("/ebls", { scroll: true });
      router.refresh();
    }
  }

  const handleClick = () => {
    if (action === "AMEND") router.push(`/ebls/${ebl.bl?.id}/edit`);
    else setDialogOpen(true);
  };

  if (isEmpty(ebl.allow_actions ?? [])) return null;

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
          loading={isLoading}
          onClick={handleClick}
        >
          {action && allowActions[action]?.icon} {action && allowActions[action]?.label}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex h-[2.75rem] w-[2.5rem] select-none items-center justify-center rounded-none rounded-r-md bg-[#F86919] px-0 py-0 text-white hover:bg-[#FF965C] focus-visible:ring-0 active:bg-[#D24B00] disabled:border-[1px] disabled:border-[#CAD2E0] disabled:bg-[#F1F0F0] disabled:text-disabled"
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

      <EBlConfirmationDialog
        open={dialogOpen}
        state={dialogState}
        action={action as DialogActionType}
        nextPartyName={nextPartyName}
        onCancel={handleDialogCanceled}
        onConfirm={handleDialogConfirmed}
      />
    </>
  );
};

export default ActionPanel;
