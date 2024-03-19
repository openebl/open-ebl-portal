import AccomplishDialogIcon from "@/app/_icons/accomplish-dialog-icon";
import PaperPlaneIcon from "@/app/_icons/paper-plane-icon";
import PrintToPaperIcon from "@/app/_icons/print-to-paper-icon";
import { EBlAllowAction } from "@/types/ebl";
import { type DialogState, ConfirmationDialog } from "./confirmation-dialog";

export type ActionType = EBlAllowAction | "issue" | "saveDraft"

// TODO: party name also be argument
const generateDialogContent = (actionType: ActionType) => {
  let confirmTitle = '';
  let confirmMessage = '';
  let confirmButton = 'Ok';
  let completedIcon = <PaperPlaneIcon />
  let completedMessage = ''

  switch (actionType) {
    case "issue":
    case EBlAllowAction.UpdateDraft:
      confirmTitle = "Are you sure you want to issue this eBL?";
      confirmMessage = "Please ensure that the information provided and the parties selected are accurate.";
      confirmButton = "Issue eBL";
      completedMessage = "The eBL has been issued to <party name>.";
      break;
    case EBlAllowAction.RequestAmend:
      confirmTitle = "Are you sure you want to send an amendment request?";
      completedMessage = "The amendment request has been sent to <issuing agent name>.";
      break;
    case EBlAllowAction.Transfer:
      confirmTitle = "Are you sure you want to transfer this eBL to <next party’s name>?";
      completedMessage = "The eBL has been transferred to <party name.>";
      break;
    case EBlAllowAction.Surrender:
      confirmTitle = "Are you sure you want to surrender this eBL to <release agent’s name>?";
      completedMessage = "The eBL has been surrendered to <release agent's name>.";
      break;
    case EBlAllowAction.Accomplish:
      confirmTitle = "Are you sure you want to accomplish this eBL?";
      completedMessage = "The eBL has been accomplished";
      completedIcon = <AccomplishDialogIcon />
      break;
    case EBlAllowAction.Print:
      confirmTitle = "Are you sure you want to print this eBL to paper?";
      confirmMessage = "The whole transferring process will be terminated.";
      confirmButton = "Print to Paper";
      completedMessage = "The eBL has been printed to paper.";
      completedIcon = <PrintToPaperIcon />
      break;
    case EBlAllowAction.Return:
      confirmTitle = "Are you sure you want to return the eBL to <party’s name>?";
      completedMessage = "The eBL has been returned to <party name>.";
      break;
    case EBlAllowAction.Amend:
      confirmTitle = "Are you sure you want to send this eBL back to <requesting party name>?";
      completedMessage = "The amended eBL has been sent to <party name>.";
      break;
    case EBlAllowAction.Delete:
      confirmTitle = "Are you sure you want to delete this eBL?";
      confirmButton = "Delete";
      break;
    default:
      break;
  }

  const content = {
    confirm: {
      title: confirmTitle,
      message: confirmMessage,
      confirmButton,
    },
    waiting: {
      icon: <PaperPlaneIcon />,
      message: `Processing...`,
    },
    completed: {
      icon: completedIcon,
      message: completedMessage,
      confirmButton: "OK",
    }
  }

  return content;
}

export const EBlConfirmationDialog = ({
  open,
  state,
  action,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  state: DialogState;
  action: ActionType;
  onCancel?: () => void;
  onConfirm: () => void;
}) => {
  return (
    <ConfirmationDialog
      open={open}
      state={state}
      content={generateDialogContent(action)}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
};
