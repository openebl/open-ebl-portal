import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const NotificationDialog = ({
  open,
  message,
  icon,
  confirmTitle = "OK",
  onConfirm,
}: {
  open: boolean;
  message: string;
  icon?: React.ReactNode;
  confirmTitle?: string;
  onConfirm: () => void;
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="min-w-[500px]">
        <AlertDialogHeader className="min-h-[164px] items-center justify-center space-y-5 p-[1.875rem]">
          {icon}
          <AlertDialogTitle>{message}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm}>
            {confirmTitle}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NotificationDialog;
