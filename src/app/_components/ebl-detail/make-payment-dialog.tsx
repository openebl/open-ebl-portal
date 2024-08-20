import { ConfirmationDialog } from "@/app/_components/dialogs/confirmation-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { env } from "@/env";
import { cn, joinUrls } from "@/lib/utils";
import { type EBlRecordType } from "@/types/ebl";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useState } from "react";

const MakePaymentDialog = ({
  open,
  ebl,
  bxpayUrl,
  onClose,
}: {
  open: boolean;
  ebl: EBlRecordType;
  bxpayUrl: string;
  onClose: () => void;
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="flex w-fit max-w-max flex-col gap-5 font-content">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Payment Request</DialogTitle>
            <DialogDescription>
              <VisuallyHidden.Root>Request Payment</VisuallyHidden.Root>
            </DialogDescription>
          </DialogHeader>

          <p className="text-[0.8125rem] leading-[1.125rem]">
            Please select the payment service you would like to use:
          </p>

          <CheckList
            onSelected={(index) => {
              setSelected(index);
            }}
          />

          <DialogFooter className="flex justify-end">
            <Button variant="outline" className="w-[7.5rem]" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="w-[7.5rem]"
              disabled={selected === null}
              onClick={() => {
                setConfirmOpen(true);
              }}
            >
              Next
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        state="confirm"
        open={confirmOpen}
        content={{
          confirm: {
            title: "You’ll be redirected to BlueX Pay",
            message: "By proceeding, you agree to share all related information about this shipment with BlueX Pay.",
          },
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
        onConfirm={() => {
          setConfirmOpen(false);
          window.open(joinUrls(bxpayUrl, `/payables/unpaid/${ebl.bl?.id}`), "_blank");
        }}
      />
    </>
  );
};

const CheckList = ({ onSelected }: { onSelected: (index: number) => void }) => {
  const rows = [
    { label: "BlueX Pay", icon: <BlueXIcon />, connected: true },
    { label: "SJ Bank", icon: <SjBankIcon />, connected: false },
    { label: "QVC Financing", icon: <QvcFinancingIcon />, connected: false },
  ];

  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex w-[37.5rem] flex-col gap-2">
      {rows.map((row, index) => (
        <div
          key={index}
          className={cn(
            "flex h-16 w-full items-center justify-between gap-5 bg-background px-5",
            selected === index
              ? "rounded-lg border border-[#004de2] bg-[#004DE329]"
              : "cursor-pointer rounded-lg bg-background",
          )}
          onClick={() => {
            setSelected(index);
            onSelected(index);
          }}
        >
          <div className="flex items-center gap-5">
            {row.icon}
            <p className="text-lg font-semibold">{row.label}</p>
          </div>
          {row.connected && (
            <div className="flex h-[1.3125rem] items-center rounded border border-[#91a4c9] bg-[#e2e6ee] px-2.5 text-[10px] font-semibold text-[#91A5C9]">
              Connected
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const BlueXIcon = () => {
  return (
    <svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M38.48 4.95c-.38-.39-.83-.7-1.34-.93a1.04 1.04 0 0 0-1.46 1.05c.25 2.4-.54 5.49-2.2 8.82a.76.76 0 0 1-1.27.16 51.77 51.77 0 0 0-2.91-3.16C20.24 1.84 9.68-2.28 5.7 1.7l-.01.02c-.63.62-.22 1.68.67 1.74 5.05.32 12.23 4.25 18.66 10.67a51.15 51.15 0 0 1 4.36 4.96c.29.37.29.88 0 1.25a51.15 51.15 0 0 1-4.36 4.96c-6.43 6.42-13.61 10.36-18.66 10.68a1.02 1.02 0 0 0-.67 1.73l.01.02c3.98 3.98 14.54-.13 23.6-9.19a51.63 51.63 0 0 0 2.91-3.16.76.76 0 0 1 1.27.16c1.66 3.34 2.45 6.42 2.2 8.82-.09.8.73 1.4 1.46 1.06.5-.24.96-.55 1.34-.94 2.64-2.63 1.72-8.17-1.83-14.23-.2-.33-.2-.74 0-1.07 3.55-6.06 4.47-11.6 1.83-14.23Z"
        fill="#009BD2"
      />
      <path
        d="M14.98 25.42a51.07 51.07 0 0 1-4.36-4.94c-.28-.38-.28-.9 0-1.27a51.13 51.13 0 0 1 4.36-4.95C21.4 7.84 28.58 3.91 33.62 3.58c.9-.05 1.3-1.12.68-1.75-3.98-3.98-14.54.13-23.6 9.18a52.3 52.3 0 0 0-2.9 3.16.77.77 0 0 1-1.28-.16c-1.66-3.33-2.44-6.4-2.2-8.8.08-.8-.74-1.4-1.47-1.06-.5.23-.95.54-1.33.92C-1.12 7.71-.2 13.24 3.35 19.3c.2.34.2.75 0 1.08-3.55 6.06-4.47 11.6-1.83 14.23.38.38.83.69 1.33.92.73.35 1.55-.25 1.47-1.06-.24-2.4.54-5.47 2.2-8.8a.77.77 0 0 1 1.28-.15 52.1 52.1 0 0 0 2.9 3.15c9.06 9.05 19.62 13.17 23.6 9.19.63-.64.21-1.7-.68-1.76-5.05-.33-12.22-4.26-18.64-10.68Z"
        fill="#97E4FF"
      />
    </svg>
  );
};

const SjBankIcon = () => {
  return (
    <svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#a)">
        <path
          d="M39.92 29.78 33.34 2.27A2.96 2.96 0 0 0 29.78.08L24.1 1.44c1.44.22 4.3.85 7.46 2.5l-2.47 6.84s-2.05-2.3-7.56-2.57c-5.23-.27-8.14 5.4 2.06 8.73 7.82 2.56 10.32 7.48 10.19 12.04a10.9 10.9 0 0 1-1.86 5.75l5.8-1.39a2.96 2.96 0 0 0 2.19-3.56m-22.17-6.99c-5.31-2-9.77-5.59-10.07-10.25-.19-2.98.56-5.58 2.5-7.77L2.27 6.66a2.96 2.96 0 0 0-2.19 3.56l6.58 27.51a2.96 2.96 0 0 0 3.56 2.19l3.39-.81a38.44 38.44 0 0 1-5.76-2.43L11 29.52s3.72 3.31 9.05 3.31 7.7-6.26-2.3-10.04"
          fill="#EF4D37"
        />
        <path
          d="M7.68 12.54c-.16-2.57.37-4.85 1.75-6.83L2.44 7.38A2.22 2.22 0 0 0 .8 10.05l3.78 15.8c1.2-1.47 4.05-4.5 8.18-5.63-2.87-2-4.88-4.6-5.08-7.68Zm24.94-10.1A2.22 2.22 0 0 0 29.95.8l-4.11.98c1.99.49 3.91 1.21 5.73 2.16l-2.47 6.84s-2.05-2.3-7.56-2.57c-5.23-.27-8.14 5.4 2.07 8.73 2.67.88 4.72 2.03 6.26 3.35l.18-.06c1.98-.73 3.89-3.33 5.29-6.43L32.62 2.44Z"
          fill="url(#b)"
        />
      </g>
      <defs>
        <radialGradient
          id="b"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(2272.54 0 0 1649.76 1705.83 1087.65)"
        >
          <stop stopColor="#F8953E" />
          <stop offset="1" stopColor="#F36E3E" />
        </radialGradient>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h40v40H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

const QvcFinancingIcon = () => {
  return (
    <svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#fff" d="M0 0h40v40H0z" />
      <g fillRule="evenodd" clipRule="evenodd" fill="#000">
        <path d="M13.66 25.97c-.6 0-2.38-.23-2.94-.6a4.39 4.39 0 0 0-1.86-.59c3.25-.54 5.72-3.14 5.72-6.26 0-3.52-3.13-6.37-7-6.37-3.86 0-7 2.85-7 6.37 0 2.98 2.42 5.56 5.45 6.26-.57.04-1.97.24-2.25.88-.29.63.41 1.04.62.76.3-.41.68-.86 1.76-.29.91.49 3.01 1.75 4.63 1.78a5 5 0 0 0 3.23-1.2c.28-.23.34-.74-.36-.74Zm-9.48-7.45c0-3.12 1.52-5.65 3.4-5.65 1.89 0 3.41 2.53 3.41 5.65 0 3.12-1.52 5.65-3.4 5.65-1.89 0-3.41-2.53-3.41-5.65Z" />
        <path d="M26.26 13.44c.57-.03.48-.8-.1-.76-.57.03-2.79.03-3.36-.03-.57-.07-.7.16-.66.44.03.29.38.38.7.38.98 0 .85.8.66 1.2l-2.76 6.22-3.07-6.34c-.51-1.05.06-1.11.72-1.11.65 0 .39-.89-.09-.86-.48.04-2.16.07-2.89.07s-1.93-.07-2.6-.1c-.66-.03-.5.76-.12.83.98.06 1.17.79 1.42 1.33l4.92 10.12c.1.28.47.22.6-.04l5.08-10.3c.4-.92.98-1.02 1.55-1.05Z" />
        <path d="M31.77 12.96c2.44-.03 3.24 2.35 3.52 3.87.03.22.22.41.35.13l1.46-3.46a14.36 14.36 0 0 0-5.58-1.36c-1.3 0-7.34.97-7.46 6.15-.12 5.58 5.4 6.66 7.58 6.63 1.94-.03 4.48-.92 5.33-1.5l-.66-3.26c-.1-.22-.32-.16-.38 0C34.53 24 32.85 24 31.7 24c-2.54-.03-4-2.44-3.97-5.55.04-3.1 1.59-5.46 4.03-5.49Zm6.7-.1a.94.94 0 1 0 0 1.87.94.94 0 1 0 0-1.87Zm0 1.72a.76.76 0 0 1-.77-.79c0-.44.34-.77.76-.77.43 0 .76.33.76.77 0 .46-.33.79-.76.79Z" />
        <path d="M38.62 13.86c.16-.02.28-.1.28-.3 0-.21-.13-.3-.38-.3h-.42v1.08h.17v-.47h.19l.28.47h.18l-.3-.48Zm-.35-.13v-.34h.22c.11 0 .24.03.24.16 0 .17-.13.18-.27.18h-.2Z" />
      </g>
    </svg>
  );
};

export default MakePaymentDialog;
