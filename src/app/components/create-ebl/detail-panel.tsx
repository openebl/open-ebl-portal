"use client";

import { eBlDraftFormSchema } from "@/types/ebl";
import { type Control, type FieldValues, useForm, type FieldPath } from "react-hook-form";
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

const SelectField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
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

const DetailPanel = () => {
  const blTypes = [{ name: "HBL Non-negotiable", value: "hbl-non-negotiable" }];

  const form = useForm<z.infer<typeof eBlDraftFormSchema>>({
    resolver: zodResolver(eBlDraftFormSchema),
    defaultValues: {
      blNumber: "",
    },
  });

  function onSubmit(values: z.infer<typeof eBlDraftFormSchema>) {
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

          <SelectField control={form.control} label="B/L Type" required={true} name="blType" items={blTypes} />
          <SelectField control={form.control} label="POL" required={true} name="pol" items={ports} />
          <SelectField control={form.control} label="POD" required={true} name="pod" items={ports} />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default DetailPanel;
