import CalendarIcon from "@/app/_icons/calendar-icon";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import type { TFormItemBuilder } from "./types";
import { hFormItemBuilder } from "./h-form";

type DateFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  label: string;
  required?: boolean;
  control: Control<TFieldValues>;
  name: TName;
  formItemBuilder?: TFormItemBuilder;
};

const DateFormField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  required,
  control,
  name,
  formItemBuilder = hFormItemBuilder,
}: DateFormFieldProps<TFieldValues, TName>) => {
  const TFormItem = formItemBuilder();
  const [pickerOpen, setPickerOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <TFormItem label={label} required={required}>
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
            <PopoverContent className="w-auto p-0 font-content" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(val) => {
                  field.onChange(val);
                  setPickerOpen(false);
                }}
                // disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </TFormItem>
      )}
    />
  );
};

export default DateFormField;
