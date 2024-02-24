import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ProgressDialog = ({
  open,
  message,
  icon,
}: {
  open: boolean;
  message: string;
  icon?: React.ReactNode;
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="min-w-[500px]">
        <AlertDialogHeader className="min-h-[220px] items-center justify-center space-y-5 p-[1.875rem]">
          {icon}
          <AlertDialogTitle>{message}</AlertDialogTitle>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProgressDialog;
