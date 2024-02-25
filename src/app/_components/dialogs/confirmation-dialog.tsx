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

export type DialogState = "confirm" | "waiting" | "completed";
export type DialogContent = {
  [key in DialogState]?: {
    title?: string;
    icon?: React.ReactNode;
    message?: string;
    cancelButton?: string;
    confirmButton?: string;
  };
};

export const ConfirmationDialog = ({
  open,
  state,
  content,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  state: DialogState;
  content: DialogContent;
  onCancel?: () => void;
  onConfirm: () => void;
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="min-w-[500px]">
        {state === "confirm" && (
          <>
            <AlertDialogHeader className="min-h-[164px]">
              <AlertDialogTitle>{content.confirm?.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {content.confirm?.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={onCancel}>
                {content.confirm?.cancelButton ?? "Cancel"}
              </AlertDialogCancel>
              <AlertDialogAction onClick={onConfirm}>
                {content.confirm?.confirmButton ?? "OK"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}

        {state === "waiting" && (
          <AlertDialogHeader className="min-h-[220px] items-center justify-center space-y-5 p-[1.875rem]">
            {content.waiting?.icon}
            <AlertDialogTitle>{content.waiting?.message}</AlertDialogTitle>
          </AlertDialogHeader>
        )}

        {state === "completed" && (
          <>
            <AlertDialogHeader className="min-h-[164px] items-center justify-center space-y-5 p-[1.875rem]">
              {content.completed?.icon}
              <AlertDialogTitle>{content.completed?.message}</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={onConfirm}>
                {content.completed?.confirmButton ?? "OK"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
