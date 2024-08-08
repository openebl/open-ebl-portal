import { ConfirmationDialog, type DialogState } from "@/app/_components/dialogs/confirmation-dialog";
import AccomplishDialogIcon from "@/app/_icons/accomplish-dialog-icon";
import DocIcon from "@/app/_icons/doc-icon";
import PaperPlaneIcon from "@/app/_icons/paper-plane-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { currentStatus, getNextPartyIDByCurrentStatus } from "@/lib/ebl";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type EBlRecordType } from "@/types/ebl";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { dotSpinner } from "ldrs";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

const PaymentDialog = ({ open, ebl, onClose }: { open: boolean; ebl: EBlRecordType; onClose: () => void }) => {
  dotSpinner.register();
  const router = useRouter();

  const [status, setStatus] = useState<"idle" | "scanning" | "confirming">("idle");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<DialogState>("confirm");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = api.paymentRequest.create.useMutation({
    onError: (error) => {
      toast.error(`Failed to create payment request: ${error.message}`);
    },
    onSuccess: () => {
      setConfirmState("completed");
    },
  });

  const onFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files?.[0]) {
      setStatus("scanning");
      setTimeout(() => setStatus("confirming"), 5000);
    }
  };

  const createPaymentRequest = () => {
    const nextPartyID = getNextPartyIDByCurrentStatus(ebl, currentStatus(ebl));
    mutation.mutate({
      eBlId: ebl.bl!.id!,
      payerBusinessUnitId: nextPartyID,
      invoiceAmount: "10500",
      message: message,
      docs: [
        {
          fileName: "INV_49279.pdf",
          docId: "INV_49279.pdf|11223",
          docType: "Invoice",
        },
        {
          fileName: "PL_ref4593.pdf",
          docId: "PL_ref4593.pdf|11223",
          docType: "Packing List",
        },
      ],
    });
  };

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
            Please attach the invoice and any other documents for your customer.
          </p>

          {status === "idle" && (
            <div>
              <Button variant="outline" className="h-11 w-[11.25rem]" onClick={() => fileInputRef.current?.click()}>
                Upload
              </Button>
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                multiple
                accept="image/png,image/jpeg,application/pdf"
                onChange={onFilesChange}
              />
            </div>
          )}

          {status === "scanning" && (
            <div className="flex h-[4.375rem] w-full items-center gap-5 bg-[#004DE329] px-5">
              <l-dot-spinner size="34" speed="1" color="#004DE3" />
              <p className="text-sm font-semibold text-secondary1">BlueX AI is analyzing your documents...</p>
            </div>
          )}

          {status === "confirming" && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-end justify-start gap-2">
                <p className="text-sm">Invoice Amount: </p>
                <p className="text-baes font-semibold">$ 10,500.00</p>
              </div>
              <CheckList />
              <p className="text-xs">
                These documents are all related to the same shipment, and all the required information is consistent.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <p className="pt-2.5 text-[0.8125rem] leading-[1.125rem]">Message:</p>
            <Textarea
              className="h-[7.5rem] w-[37.5rem] shadow-inner"
              placeholder="(Optional)"
              onChange={(event) => setMessage(event.target.value ?? "")}
            />
          </div>

          <DialogFooter className="flex justify-end">
            <Button variant="outline" className="w-[7.5rem]" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="default"
              className="w-[7.5rem]"
              onClick={() => {
                setConfirmState("confirm");
                setConfirmOpen(true);
              }}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {confirmOpen && (
        <ConfirmationDialog
          open={confirmOpen}
          state={confirmState}
          content={{
            confirm: {
              title: "Are you sure you want to send the payment request?",
              message: "Please ensure that the information provided and the parties selected are accurate.",
            },
            waiting: {
              icon: <PaperPlaneIcon />,
              message: `Processing...`,
            },
            completed: {
              icon: <AccomplishDialogIcon />,
              message: "The payment request has been sent to SSS Consignee.",
            },
          }}
          onCancel={() => {
            setConfirmOpen(false);
          }}
          onConfirm={() => {
            if (confirmState === "confirm") {
              createPaymentRequest();
            } else {
              setConfirmOpen(false);
              onClose();
              router.refresh();
            }
          }}
        />
      )}
    </>
  );
};

const CheckList = () => {
  const rows = [
    { label: "Shipper", invoice: true, packingList: true },
    { label: "Bill To", invoice: true, packingList: true },
    { label: "Invoice No.", invoice: true, packingList: true },
    { label: "BL No.", invoice: false, packingList: true },
    { label: "PO No.", invoice: true, packingList: true },
    { label: "Quantity", invoice: true, packingList: true },
    { label: "Gross Weight", invoice: true, packingList: true },
    { label: "Measurement", invoice: false, packingList: true },
  ];

  return (
    <div className="w-full border-secondary1">
      <table className="w-full rounded-lg bg-secondary1">
        <thead>
          <tr className="h-7">
            <th></th>
            <th>
              <div className="flex w-full justify-center gap-2 text-[0.8125rem] font-semibold text-white">
                <DocIcon />
                Invoice
              </div>
            </th>
            <th>
              <div className="flex w-full justify-center gap-2 text-[0.8125rem] font-semibold text-white">
                <DocIcon />
                Packing List
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={cn(
                "h-[1.625rem] text-xs",
                index % 2 === 0 ? "bg-blue-50" : "bg-blue-100",
                index === rows.length - 1 ? "rounded-b-lg border-b-blue-50" : "",
              )}
            >
              <td className="h-[1.75rem] px-4">{row.label}</td>
              <td className="px-4">
                <div className="flex w-full justify-center">{row.invoice && <CheckIcon />}</div>
              </td>
              <td className="px-4 py-2 text-center">
                <div className="flex w-full justify-center">{row.packingList && <CheckIcon />}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CheckIcon = () => {
  return (
    <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m5.83 14-.04-.03-.02.03L1 9.18l1.7-1.72 3.1 3.14L13.3 3 15 4.72 5.83 14Z"
        fill="#42BE25"
      />
    </svg>
  );
};

export default PaymentDialog;
