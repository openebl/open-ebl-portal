import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ConfirmationDialog = ({
  open,
  title,
  message,
  cancelTitle = "Cancel",
  confirmTitle = "Confirm",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  cancelTitle?: string;
  confirmTitle?: string;
  onCancel?: () => void;
  onConfirm: () => void;
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="min-w-[500px]">
        <AlertDialogHeader className="min-h-[164px]">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelTitle}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmTitle}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
