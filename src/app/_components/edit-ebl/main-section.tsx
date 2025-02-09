"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/trpc/react";

import { type DialogState } from "@/app/_components/dialogs/confirmation-dialog";
import SendIcon from "@/app/_icons/send-icon.svg";
import { Button } from "@/components/ui/button";
import {
  type EBlFormType,
  EBlFormSchema,
  EBlFormUpdateSchema,
  type EBlRecordType,
  EBlFormAmendSchema,
} from "@/types/ebl";
import DetailPanel from "./detail-panel";
import PreviewPanel from "./preview-panel";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type AppRouter } from "@/server/api/root";
import { portName } from "@/lib/ports";
import { type DialogActionType, EBlConfirmationDialog } from "../dialogs/ebl-confirmation-dialog";
import { currentStatus, eblParties, getNextPartyIDByAction, getNextPartyIDByCurrentStatus } from "@/lib/ebl";

const MainSection = ({ eblForm, eblRecord }: { eblForm: EBlFormType; eblRecord: EBlRecordType | undefined }) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>("confirm");
  const [action, setAction] = useState<DialogActionType>("ISSUE");

  const isNewEbl = !eblRecord;
  const eblId = eblRecord?.bl?.id ?? "";
  const status = eblRecord && currentStatus(eblRecord);
  const documentParties = eblRecord && eblParties(eblRecord);
  const isAmendMode =
    status === "REQUEST_AMEND" || (status === "RETURN" && eblRecord?.bl?.current_owner === documentParties?.issuer);
  const title = isNewEbl ? "New eBL" : isAmendMode ? "Amend eBL" : "Edit eBL";

  const form = useForm<EBlFormType>({
    resolver: zodResolver(isAmendMode ? EBlFormAmendSchema.omit({ ebl_id: true }) : EBlFormSchema),
    defaultValues: {
      ...eblForm,
    },
  });

  // TODO: do not download whole bu list
  const { data: bulist } = api.buinfo.all.useQuery(undefined, {
    staleTime: 1000 * 5 * 60,
  });
  let nextPartyName = bulist?.[form.getValues().shipper]?.legalBusinessName;
  if (isAmendMode) {
    if (status === "REQUEST_AMEND")
      nextPartyName = bulist?.[getNextPartyIDByAction(eblRecord!, "AMEND")]?.legalBusinessName;
    else if (status === "RETURN")
      nextPartyName = bulist?.[getNextPartyIDByCurrentStatus(eblRecord!, "RETURN")]?.legalBusinessName;
  }

  const actionHandlerCallback = () => ({
    onSuccess: () => {
      if (["SAVE_DRAFT", "DELETE"].includes(action)) {
        setDialogOpen(false);
        router.push("/ebls", { scroll: true });
        router.refresh();
      } else {
        setDialogState("completed");
      }
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      setDialogOpen(false);
      toast.error(`Failed to ${action} eBL: ${error.message}`);
      console.error(error);
    },
  });
  const issueEBl = api.ebl.issue.useMutation(actionHandlerCallback());
  const updateEBl = api.ebl.updateDraft.useMutation(actionHandlerCallback());
  const deleteEBl = api.ebl.delete.useMutation(actionHandlerCallback());
  const amendEBl = api.ebl.amend.useMutation(actionHandlerCallback());

  const getFormData = () => {
    const formData = form.getValues();
    formData.pol.locationName = portName(formData.pol.UNLocationCode) ?? formData.pol.locationName;
    formData.pod.locationName = portName(formData.pod.UNLocationCode) ?? formData.pod.locationName;
    return formData;
  };

  const checkFormValue = async (): Promise<boolean> => {
    const r = await form.trigger(undefined, { shouldFocus: true });
    if (!r) {
      console.error(form.formState.errors);
      return false;
    }
    return true;
  };

  const issue = async (payload: { isDraft: boolean }) => {
    if (!(await checkFormValue())) return;

    setDialogState("waiting");
    setDialogOpen(true);
    if (isNewEbl) {
      payload.isDraft ? setAction("SAVE_DRAFT") : setAction("ISSUE");
      const formData = getFormData();
      const body = EBlFormSchema.parse({ ...formData, draft: payload.isDraft });
      issueEBl.mutate(body);
    } else {
      updateDraft();
    }
  };
  const saveDraft = async () => {
    await issue({ isDraft: true });
  };
  const updateDraft = () => {
    if (!isNewEbl) {
      setAction("UPDATE_DRAFT");
      setDialogState("waiting");
      setDialogOpen(true);
      const formData = getFormData();
      const body = EBlFormUpdateSchema.parse({
        ...formData,
        ebl_id: eblId,
        draft: false,
      });
      updateEBl.mutate(body);
    }
  };
  const deleteDraft = () => {
    if (!isNewEbl) {
      setAction("DELETE");
      setDialogState("waiting");
      setDialogOpen(true);
      deleteEBl.mutate({ id: eblId, note: form.getValues().note ?? "" });
    }
  };
  const amend = () => {
    setAction("AMEND");
    setDialogState("waiting");
    setDialogOpen(true);
    const formData = getFormData();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { shipper, consignee, release_agent, draft, ...rest } = formData;
    const body = EBlFormAmendSchema.parse({ ...rest, ebl_id: eblId });
    amendEBl.mutate(body);
  };

  const openConfirmationDialog = async (action: DialogActionType) => {
    if (!(await checkFormValue())) return;

    setAction(action);
    setDialogOpen(true);
    setDialogState("confirm");
  };

  const handleDialogCanceled = () => {
    setDialogOpen(false);
  };
  const handleDialogConfirmed = async () => {
    if (dialogState === "confirm") {
      if (action === "ISSUE") {
        setDialogState("waiting");
        await issue({ isDraft: false });
      } else if (action === "AMEND") {
        setDialogState("waiting");
        amend();
      } else if (action === "DELETE") {
        deleteDraft();
      }
    } else {
      setDialogOpen(false);
      router.push("/ebls", { scroll: true });
      router.refresh();
    }
  };

  // useCallback: memo the function reference to prevent re-render
  const updateFormDataByNewEBl = useCallback(
    (formData: EBlFormType) => {
      form.setValue("bl_number", formData.bl_number);
      form.setValue("pol", formData.pol);
      form.setValue("pod", formData.pod);
      form.setValue("file", formData.file);
      form.setValue("metadata.docHash", formData.metadata.docHash);
      if (!isAmendMode) {
        // Do not update parties if in amend mode
        form.setValue("shipper", formData.shipper);
        form.setValue("consignee", formData.consignee);
        form.setValue("release_agent", formData.release_agent);
        // form.setValue("notifyParties", formData.notifyParties)
      }
    },
    [form, isAmendMode],
  );

  return (
    <div className="px-12 py-10 font-content">
      <div className="text-2xl font-bold leading-9 text-main">{title}</div>

      <div className="mt-[1.875rem] flex h-[53.5rem] flex-col justify-between rounded-lg border border-solid border-border-light bg-white shadow-lg">
        <div className="flex h-[48.125rem] items-stretch">
          <PreviewPanel
            docId={eblRecord?.bl?.id ?? ""}
            form={form}
            updateFormDataByNewEBl={updateFormDataByNewEBl}
          />
          <DetailPanel
            form={form}
            isAmendMode={isAmendMode}
          />
        </div>

        <div className="flex h-[5.25rem] w-full items-center justify-between border-t-[1px] border-[#D9D9D9] px-[1.875rem]">
          <div className="flex gap-4">
            <Link
              href="/ebls"
              tabIndex={-1}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-[11.25rem]"
              >
                Cancel
              </Button>
            </Link>
            {!isNewEbl && !isAmendMode && (
              <Button
                variant="outline"
                size="lg"
                className="w-[11.25rem]"
                onClick={() => openConfirmationDialog("DELETE")}
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2.5">
            {isNewEbl && (
              <Button
                variant="outline"
                size="lg"
                className="w-[11.25rem]"
                onClick={saveDraft}
              >
                Save as Draft
              </Button>
            )}
            <Button
              size="lg"
              className="w-[11.25rem]"
              onClick={!isAmendMode ? () => openConfirmationDialog("ISSUE") : () => openConfirmationDialog("AMEND")}
            >
              <SendIcon className="mr-1" />
              {isNewEbl ? "Issue eBL" : "Transfer"}
            </Button>
          </div>
        </div>
      </div>

      <EBlConfirmationDialog
        open={dialogOpen}
        state={dialogState}
        action={action}
        nextPartyName={nextPartyName ?? ""}
        onCancel={handleDialogCanceled}
        onConfirm={handleDialogConfirmed}
      />
    </div>
  );
};

export default MainSection;
