"use client";

import {
  type EBlType,
  EBlDraftFormSchema,
  type EBlDraftFormType,
} from "@/types/ebl";
import {
  type Control,
  type FieldValues,
  useForm,
  type FieldPath,
} from "react-hook-form";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ports } from "@/lib/ports";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import CalendarIcon from "@/app/_icons/calendar-icon";
import { Calendar } from "@/components/ui/calendar";
import { inter } from "@/app/fonts";
import { format } from "date-fns";
import React from "react";
import { consignees, shippers } from "@/lib/parties";
import { Textarea } from "@/components/ui/textarea";

const BFormItem = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <FormItem className="flex items-start justify-between space-y-0">
    <FormLabel className="w-[8.75rem] flex-none bg-transparent text-[0.8125rem] font-semibold leading-10 text-light">
      {label}
      {required && <span className="ml-1 text-[#E42525]">*</span>}
    </FormLabel>
    <div className="flex flex-col">
      <FormControl>{children}</FormControl>
      <FormMessage className="mx-2" />
    </div>
  </FormItem>
);

type SelectFieldItem = {
  name: string;
  value: string;
};

const SelectField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  required,
  control,
  name,
  items,
}: {
  label: string;
  required?: boolean;
  control: Control<TFieldValues>;
  name: TName;
  items: SelectFieldItem[];
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <BFormItem label={label} required={required}>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="w-[21.25rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="font-content">
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </BFormItem>
      )}
    />
  );
};

const DateField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  required,
  control,
  name,
}: {
  label: string;
  required?: boolean;
  control: Control<TFieldValues>;
  name: TName;
}) => {
  const [pickerOpen, setPickerOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <BFormItem label={label} required={required}>
          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className="flex h-10 w-[21.25rem] rounded-lg border border-border-dark bg-background px-0 py-2 pl-3 text-[0.8125rem] font-normal leading-[1.125rem] text-main
                ring-offset-border-light hover:bg-background hover:text-main focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-[#3C7EFF] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-[#F1F0F0]"
                >
                  {field.value ? (
                    format(field.value, "MM/dd/yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <div className="ml-auto flex h-10 w-10 items-center justify-center border-l border-border-dark">
                    <CalendarIcon className="opacity-50" />
                  </div>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className={cn("w-auto p-0 font-content", inter.variable)}
              align="start"
            >
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(val) => {
                  field.onChange(val);
                  setPickerOpen(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </BFormItem>
      )}
    />
  );
};

const DetailPanel = ({ ebl }: { ebl: EBlDraftFormType }) => {
  const blTypes = [{ name: "HBL Non-negotiable", value: "hbl-non-negotiable" }];

  const form = useForm<z.infer<typeof EBlDraftFormSchema>>({
    resolver: zodResolver(EBlDraftFormSchema),
    defaultValues: {
      ...ebl,
    },
  });

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
              <BFormItem label="B/L No." required={true}>
                <Input className="h-10 w-[21.25rem] shadow-inner" {...field} />
              </BFormItem>
            )}
          />

          <SelectField
            control={form.control}
            label="B/L Type"
            required={true}
            name="blType"
            items={blTypes}
          />
          <SelectField
            control={form.control}
            label="POL"
            required={true}
            name="pol"
            items={ports}
          />
          <SelectField
            control={form.control}
            label="POD"
            required={true}
            name="pod"
            items={ports}
          />
          <DateField
            control={form.control}
            label="ETA"
            required={true}
            name="eta"
          />
          <SelectField
            control={form.control}
            label="Shipper"
            required={true}
            name="shipper"
            items={shippers}
          />
          <SelectField
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
              <BFormItem label="Notes" required={false}>
                <Textarea
                  placeholder=""
                  className="h-[10.625rem] w-[21.25rem] resize-none font-normal"
                  {...field}
                />
              </BFormItem>
            )}
          />

          <Button
            type="button"
            onClick={async () => {
              const r = await form.trigger(undefined, { shouldFocus: true });
              console.log(form.getValues(), r)
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
