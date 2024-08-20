"use client";

import { Button } from "@/components/ui/button";
import { eblParties } from "@/lib/ebl";
import { type EBlRecordType } from "@/types/ebl";
import PaymentDialog from "./payment-dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import MakePaymentDialog from "./make-payment-dialog";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import CircleInCheckIcon from "@/app/_icons/check-in-circle-icon.svg";
import { ConfirmationDialog } from "../dialogs/confirmation-dialog";

interface PaymentRequest {
  payerName: string;
  createdAt: Date;
  invoiceAmount: string;
  status: string;
  message: string;
  PaymentRequestDocs: {
    fileName: string;
    docType: string;
  }[];
}

const PaymentRequestSection = ({
  ebl,
  businessUnitId,
  paymentRequest,
  bxpayUrl,
}: {
  ebl: EBlRecordType;
  businessUnitId: string | undefined;
  bxpayUrl: string;
  paymentRequest?: PaymentRequest;
}) => {
  const router = useRouter();
  const [openPayment, setOpenPayment] = useState(false);
  const [openMakePayment, setOpenMakePayment] = useState(false);
  const [openConfirmPayment, setOpenConfirmPayment] = useState(false);

  const documentParties = eblParties(ebl);
  const shipperId = documentParties?.shipper ?? "";
  const importerId = documentParties?.consignee ?? "";
  const isPayer = importerId === businessUnitId;

  if (!shouldShowPaymentRequest(ebl, businessUnitId, shipperId, importerId, paymentRequest)) {
    return null;
  }

  const mutation = api.paymentRequest.confirmPayment.useMutation({
    onSuccess: () => {
      router.refresh();
      setOpenConfirmPayment(false);
    },
    onError: (err) => {
      alert(`Failed to confirm payment: ${String(err)}`);
      setOpenConfirmPayment(false);
    },
  });

  return (
    <section className="border-bolder-light flex w-full flex-col items-start rounded-lg border border-solid bg-white px-[1.875rem] py-[1.875rem] font-content shadow-lg">
      <header className="whitespace-nowrap text-[1.375rem] font-semibold leading-8 text-main">Payment Request</header>

      {!paymentRequest ? (
        <RequestPaymentSection setOpenPayment={setOpenPayment} />
      ) : (
        <PaymentDetailsSection
          paymentRequest={paymentRequest}
          isPayer={isPayer}
          setOpenMakePayment={setOpenMakePayment}
          setOpenConfirmPayment={setOpenConfirmPayment}
        />
      )}

      {openPayment && <PaymentDialog open={openPayment} ebl={ebl} onClose={() => setOpenPayment(false)} />}
      {openMakePayment && (
        <MakePaymentDialog
          open={openMakePayment}
          ebl={ebl}
          bxpayUrl={bxpayUrl}
          onClose={() => setOpenMakePayment(false)}
        />
      )}
      {openConfirmPayment && (
        <ConfirmationDialog
          open={openConfirmPayment}
          state="confirm"
          content={{
            confirm: {
              title: "Are you sure you want to confirm the payment?",
            },
          }}
          className="min-w-[40rem]"
          onCancel={() => {
            setOpenConfirmPayment(false);
          }}
          onConfirm={() => mutation.mutate({ eBlId: ebl.bl?.id ?? "" })}
        />
      )}
    </section>
  );
};

const shouldShowPaymentRequest = (
  ebl: EBlRecordType,
  businessUnitId: string | undefined,
  shipperId: string,
  importerId: string,
  paymentRequest?: PaymentRequest,
) => {
  return (
    (ebl.bl?.current_owner === businessUnitId && shipperId === businessUnitId) ||
    (paymentRequest && importerId === businessUnitId)
  );
};

const RequestPaymentSection = ({ setOpenPayment }: { setOpenPayment: (open: boolean) => void }) => (
  <>
    <p className="pb-5 pt-[1.875rem] text-sm">
      Would you like to send your customer the invoice (and other supporting documents) to get paid before transferring
      your eBL?
    </p>
    <Button variant="outline" className="h-11 w-[180px]" onClick={() => setOpenPayment(true)}>
      Request Payment
    </Button>
  </>
);

const PaymentDetailsSection = ({
  paymentRequest,
  isPayer,
  setOpenMakePayment,
  setOpenConfirmPayment,
}: {
  paymentRequest: PaymentRequest;
  isPayer: boolean;
  setOpenMakePayment: (open: boolean) => void;
  setOpenConfirmPayment: (open: boolean) => void;
}) => (
  <div className="flex w-full justify-between">
    <div>
      <PaymentRequestInfo paymentRequest={paymentRequest} isPayer={isPayer} />
      <AttachedDocuments docs={paymentRequest.PaymentRequestDocs} />
      <Message message={paymentRequest.message} />
    </div>
    <PaymentAction
      invoiceAmount={paymentRequest.invoiceAmount}
      isPayer={isPayer}
      requestStatus={paymentRequest.status}
      setOpenMakePayment={setOpenMakePayment}
      setOpenConfirmPayment={setOpenConfirmPayment}
    />
  </div>
);

const PaymentRequestInfo = ({ paymentRequest, isPayer }: { paymentRequest: PaymentRequest; isPayer: boolean }) => (
  <div
    className={cn(
      "flex gap-1 pb-5 pt-[1.875rem] text-sm",
      isPayer && paymentRequest.status === "REQUESTED" ? "text-[#E42525]" : "",
    )}
  >
    <p>
      {isPayer ? "You received a payment request from " : "You've sent the payment request to "}
      <strong className="font-bold">{paymentRequest.payerName}</strong> on
    </p>
    <p>
      <strong className="font-bold">
        {paymentRequest.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })}
      </strong>{" "}
      at{" "}
      <strong className="font-bold">
        {paymentRequest.createdAt.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </strong>
    </p>
  </div>
);

const AttachedDocuments = ({ docs }: { docs: { fileName: string; docType: string }[] }) => (
  <>
    <p className="text-sm text-light">Attached documents:</p>
    <div className="w-[50rem] bg-background px-5 py-2.5">
      {docs.map((doc, index) => (
        <div key={index} className="flex gap-2">
          <p className="text-sm font-semibold text-secondary1">{doc.fileName}</p>
          <p className="text-sm">({doc.docType})</p>
        </div>
      ))}
    </div>
  </>
);

const Message = ({ message }: { message: string }) => (
  <>
    <p className="mt-5 text-sm text-light">Message:</p>
    <div className="w-[50rem] bg-background px-5 py-2.5">{message}</div>
  </>
);

const PaymentAction = ({
  invoiceAmount,
  isPayer,
  requestStatus,
  setOpenMakePayment,
  setOpenConfirmPayment,
}: {
  invoiceAmount: string;
  isPayer: boolean;
  requestStatus: string;
  setOpenMakePayment: (open: boolean) => void;
  setOpenConfirmPayment: (open: boolean) => void;
}) => {
  const router = useRouter();
  const mutation = api.paymentRequest.removeAll.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: () => {
      alert("Failed to reset payment request");
    },
  });

  const resetMakePayment = () => {
    if (confirm("Are you sure you want to reset the payment request?")) {
      mutation.mutate();
    }
  };

  return (
    <div className="mt-[4.6875rem] flex flex-col items-end gap-2.5">
      <p className="text-[2rem] font-semibold leading-8" onDoubleClick={() => resetMakePayment()}>
        {parseFloat(invoiceAmount).toLocaleString("en-US", { style: "currency", currency: "USD" })}
      </p>
      {isPayer && requestStatus === "REQUESTED" && (
        <Button className="h-11 w-[180px]" onClick={() => setOpenMakePayment(true)}>
          Make Payment
        </Button>
      )}

      {!isPayer &&
        (requestStatus === "REQUESTED" ? (
          <p className="text-lg font-semibold text-[#E42525]">Not received yet</p>
        ) : requestStatus === "PAID" ? (
          <Button className="h-11 w-[180px]" onClick={() => setOpenConfirmPayment(true)}>
            Confirm Payment
          </Button>
        ) : null)}

      {requestStatus === "CONFIRMED" && (
        <div className="flex flex-col items-end gap-2.5">
          <div className="flex items-center gap-2 text-lg font-semibold text-[#039912]">
            <CircleInCheckIcon className="h-5 w-5" />
            Payment Received
          </div>
          <p className="cursor-pointer text-xs font-semibold text-secondary1">View Remittance</p>
        </div>
      )}
    </div>
  );
};

export default PaymentRequestSection;
