import AccomplishDialogIcon from "@/app/_icons/accomplish-dialog-icon";
import PaperPlaneIcon from "@/app/_icons/paper-plane-icon";
import PrintToPaperIcon from "@/app/_icons/print-to-paper-icon";
import { type EBlAllowAction } from "@/types/ebl";
import { type DialogState, ConfirmationDialog } from "./confirmation-dialog";

export type DialogActionType = EBlAllowAction | "ISSUE" | "SAVE_DRAFT"

const generateDialogContent = (actionType: DialogActionType, nextPartyName: string) => {
  let confirmTitle = '';
  let confirmMessage = '';
  let confirmButton = 'Ok';
  let completedIcon = <PaperPlaneIcon />
  let completedMessage = ''

  switch (actionType) {
    case "ISSUE":
    case "UPDATE_DRAFT":
      confirmTitle = "Are you sure you want to issue this eBL?";
      confirmMessage = "Please ensure that the information provided and the parties selected are accurate.";
      confirmButton = "Issue eBL";
      completedMessage = `The eBL has been issued to ${nextPartyName}.`;
      break;
    case "REQUEST_AMEND":
      confirmTitle = "Are you sure you want to send an amendment request?";
      completedMessage = `The amendment request has been sent to ${nextPartyName}.`;
      break;
    case "TRANSFER":
      confirmTitle = `Are you sure you want to transfer this eBL to ${nextPartyName}?`;
      completedMessage = `The eBL has been transferred to ${nextPartyName}.`;
      break;
    case "SURRENDER":
      confirmTitle = `Are you sure you want to surrender this eBL to ${nextPartyName}?`;
      completedMessage = `The eBL has been surrendered to ${nextPartyName}.`;
      break;
    case "ACCOMPLISH":
      confirmTitle = "Are you sure you want to accomplish this eBL?";
      completedMessage = "The eBL has been accomplished";
      completedIcon = <AccomplishDialogIcon />
      break;
    case "PRINT":
      confirmTitle = "Are you sure you want to print this eBL to paper?";
      confirmMessage = "The whole transferring process will be terminated.";
      confirmButton = "Print to Paper";
      completedMessage = "The eBL has been printed to paper.";
      completedIcon = <PrintToPaperIcon />
      break;
    case "RETURN":
      confirmTitle = `Are you sure you want to return the eBL to ${nextPartyName}?`;
      completedMessage = `The eBL has been returned to ${nextPartyName}.`;
      break;
    case "AMEND":
      confirmTitle = `Are you sure you want to send this eBL back to ${nextPartyName}?`;
      completedMessage = `The amended eBL has been sent to ${nextPartyName}.`;
      break;
    case "DELETE":
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
  nextPartyName,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  state: DialogState;
  action: DialogActionType;
  nextPartyName: string;
  onCancel?: () => void;
  onConfirm: () => void;
}) => {
  return (
    <ConfirmationDialog
      open={open}
      state={state}
      content={generateDialogContent(action, nextPartyName)}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
};
