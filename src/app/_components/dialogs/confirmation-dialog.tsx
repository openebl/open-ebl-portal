import { animated, useTransition } from "@react-spring/web";

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

const ConfirmContent = ({
  content,
  onCancel,
  onConfirm,
}: {
  content: DialogContent;
  onCancel?: () => void;
  onConfirm: () => void;
}) => {
  return (
    <>
      <AlertDialogHeader className="min-h-[164px] min-w-[500px]">
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
  );
};

const WaitingContent = ({ content }: { content: DialogContent }) => {
  return (
    <AlertDialogHeader className="min-h-[220px] min-w-[500px] items-center justify-center space-y-5 p-[1.875rem]">
      {content.waiting?.icon}
      <AlertDialogTitle>{content.waiting?.message}</AlertDialogTitle>
    </AlertDialogHeader>
  );
};

const CompletedContent = ({
  content,
  onConfirm,
}: {
  content: DialogContent;
  onConfirm: () => void;
}) => {
  return (
    <>
      <AlertDialogHeader className="min-h-[164px] min-w-[500px] items-center justify-center space-y-5 p-[1.875rem]">
        {content.completed?.icon}
        <AlertDialogTitle>{content.completed?.message}</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={onConfirm}>
          {content.completed?.confirmButton ?? "OK"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
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
  const transitions = useTransition(state, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { position: "absolute", opacity: 0 },
  });

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="min-h-[220px] min-w-[500px]">
        <div className="relative">
          {transitions((style, item) => (
            <animated.div style={{ ...style }}>
              {item === "confirm" ? (
                <ConfirmContent
                  content={content}
                  onCancel={onCancel}
                  onConfirm={onConfirm}
                />
              ) : item === "waiting" ? (
                <WaitingContent content={content} />
              ) : (
                <CompletedContent content={content} onConfirm={onConfirm} />
              )}
            </animated.div>
          ))}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
