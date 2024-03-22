"use client";

import ComboboxField from "@/app/_components/common/form/combo-form-field";
import { HFormItem } from "@/app/_components/common/form/h-form";
import SelectFormField from "@/app/_components/common/form/select-form-field";
import {
  useFilterConsignees,
  useGetConsignee,
} from "@/app/_hooks/consignee-filter";
import { useFilterPorts, useGetPort } from "@/app/_hooks/ports-filter";
import { useFilterReleaseAgents, useGetReleaseAgent } from "@/app/_hooks/releaseAgent-filter";
import { useFilterShippers, useGetShipper } from "@/app/_hooks/shippers-filter";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type EBlFormType } from "@/types/ebl";
import { type UseFormReturn } from "react-hook-form";

const DetailPanel = ({ form, isAmendMode }: { form: UseFormReturn<EBlFormType>, isAmendMode: boolean }) => {
  const blDocTypes = [{ name: "HBL Non-negotiable", value: "HouseBillOfLading" }];
  return (
    <div className="flex w-[35rem] flex-none flex-col items-stretch py-[1.875rem] pl-[3.125rem] pr-[1.875rem]">
      <p className="text-xl font-bold leading-[1.875rem]">Details</p>
      <Form {...form}>
        <form
          className="my-[1.875rem] flex flex-col gap-2.5"
        >
          <FormField
            control={form.control}
            name="bl_number"
            render={({ field }) => (
              <HFormItem label="BL No." required={true}>
                <Input
                  className={`h-10 w-[21.25rem] shadow-inner ${form.formState.errors.bl_number && '!border-[#E42525]'}`}
                  {...field}
                />
              </HFormItem>
            )}
          />
          <SelectFormField
            control={form.control}
            label="BL Type"
            required={true}
            name="bl_doc_type"
            items={blDocTypes}
            className={form.formState.errors.bl_doc_type && '!border-[#E42525]'}
          />
          <ComboboxField
            control={form.control}
            label="POL"
            required={true}
            name="pol.UNLocationCode"
            useFilterItems={useFilterPorts}
            useGetItem={useGetPort}
            className={form.formState.errors.pol && '!border-[#E42525]'}
          />
          <ComboboxField
            control={form.control}
            label="POD"
            required={true}
            name="pod.UNLocationCode"
            useFilterItems={useFilterPorts}
            useGetItem={useGetPort}
            className={form.formState.errors.pod && '!border-[#E42525]'}
          />
          <ComboboxField
            control={form.control}
            label="Shipper"
            required={true}
            disabled={isAmendMode}
            name="shipper"
            useFilterItems={useFilterShippers}
            useGetItem={useGetShipper}
            className={form.formState.errors.shipper && '!border-[#E42525]'}
          />
          <ComboboxField
            control={form.control}
            label="Consignee"
            required={true}
            disabled={isAmendMode}
            name="consignee"
            useFilterItems={useFilterConsignees}
            useGetItem={useGetConsignee}
            className={form.formState.errors.consignee && '!border-[#E42525]'}
          />
          <ComboboxField
            control={form.control}
            label="Release Agent"
            required={true}
            disabled={isAmendMode}
            name="release_agent"
            useFilterItems={useFilterReleaseAgents}
            useGetItem={useGetReleaseAgent}
            className={form.formState.errors.release_agent && '!border-[#E42525]'}
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <HFormItem label="Notes" required={false}>
                <Textarea
                  placeholder=""
                  className={`h-[10.625rem] w-[21.25rem] resize-none font-normal ${form.formState.errors.note && '!border-[#E42525]'}`}
                  {...field}
                  value={field.value ?? ""}
                ></Textarea>
              </HFormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default DetailPanel;
