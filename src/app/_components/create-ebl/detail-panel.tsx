"use client";

import ComboboxField from "@/app/_components/common/form/combo-form-field";
import DateFormField from "@/app/_components/common/form/date-form-field";
import { HFormItem } from "@/app/_components/common/form/h-form";
import SelectFormField from "@/app/_components/common/form/select-form-field";
import usePortsFilter from "@/app/_hooks/ports-filter";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { consignees, shippers } from "@/lib/parties";
import { EBlDraftFormSchema, type EBlDraftFormType } from "@/types/ebl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";

const DetailPanel = ({ ebl }: { ebl: EBlDraftFormType }) => {
  const blTypes = [{ name: "HBL Non-negotiable", value: "hbl-non-negotiable" }];

  const form = useForm<z.infer<typeof EBlDraftFormSchema>>({
    resolver: zodResolver(EBlDraftFormSchema),
    defaultValues: {
      ...ebl,
    },
  });

  const { getPort, filterPorts } = usePortsFilter();

  function onSubmit(values: z.infer<typeof EBlDraftFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="flex w-[35rem] flex-none flex-col items-stretch py-[1.875rem] pl-[3.125rem] pr-[1.875rem]">
      <p className="text-xl font-bold leading-[1.875rem]">Details</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="my-[1.875rem] flex flex-col gap-2.5"
        >
          <FormField
            control={form.control}
            name="blNumber"
            render={({ field }) => (
              <HFormItem label="B/L No." required={true}>
                <Input className="h-10 w-[21.25rem] shadow-inner" {...field} />
              </HFormItem>
            )}
          />

          <SelectFormField
            control={form.control}
            label="B/L Type"
            required={true}
            name="blType"
            items={blTypes}
          />
          <ComboboxField
            control={form.control}
            label="POL"
            required={true}
            name="pol"
            getItem={getPort}
            filterItems={filterPorts}
          />
          <ComboboxField
            control={form.control}
            label="POD"
            required={true}
            name="pod"
            getItem={getPort}
            filterItems={filterPorts}
          />
          <DateFormField
            control={form.control}
            label="ETA"
            required={true}
            name="eta"
          />
          <SelectFormField
            control={form.control}
            label="Shipper"
            required={true}
            name="shipper"
            items={shippers}
          />
          <SelectFormField
            control={form.control}
            label="Consignee"
            required={true}
            name="consignee"
            items={consignees}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <HFormItem label="Notes" required={false}>
                <Textarea
                  placeholder=""
                  className="h-[10.625rem] w-[21.25rem] resize-none font-normal"
                  {...field}
                />
              </HFormItem>
            )}
          />

          <Button
            type="button"
            onClick={async () => {
              const r = await form.trigger(undefined, { shouldFocus: true });
              console.log(form.getValues(), r);
            }}
          >
            Draft
          </Button>
          <Button type="button">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default DetailPanel;
