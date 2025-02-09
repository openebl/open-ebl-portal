"use client";

import { Plus } from "lucide-react";
import { type Control, type FieldPath, type FieldValues, type PathValue } from "react-hook-form";

import ComboboxField from "@/app/_components/common/form/combo-form-field";
import DeleteIcon from "@/app/_icons/delete-icon.svg";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { hFormItemBuilder } from "./h-form";
import type { TFormItemBuilder } from "./types";

// Re-export the type from combo-form-field
type ComboBoxItemType = {
  value: string;
  label: string;
};

type MultiComboboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  label: string;
  required?: boolean;
  control: Control<TFieldValues>;
  name: TName;
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsMsg?: string;
  formItemBuilder?: TFormItemBuilder;
  className?: string;
  addButtonTitle?: string;
  useFilterItems: (keyword: string) => {
    items: ComboBoxItemType[];
    loading: boolean;
    isError: boolean;
  };
  useGetItem: (value: string) => {
    item: ComboBoxItemType | null;
    loading: boolean;
  };
};

const MultiComboboxField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  required,
  control,
  name,
  disabled = false,
  placeholder = "Select",
  searchPlaceholder = "Type in Keyword",
  noResultsMsg = "No results found",
  addButtonTitle,
  formItemBuilder = hFormItemBuilder,
  className,
  useFilterItems,
  useGetItem,
}: MultiComboboxFieldProps<TFieldValues, TName>) => {
  const TFormItem = formItemBuilder();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const values = (field.value ?? []) as string[];

        const handleAdd = () => {
          const newValues = [...values, ""];
          field.onChange(newValues as PathValue<TFieldValues, TName>);
        };

        const handleRemove = (index: number) => {
          const newValues = values.filter((_: string, i: number) => i !== index);
          field.onChange(newValues as PathValue<TFieldValues, TName>);
        };

        // const handleChange = (index: number, value: string) => {
        //   const newValues = [...values];
        //   newValues[index] = value;
        //   field.onChange(newValues as PathValue<TFieldValues, TName>);
        // };

        return (
          <div className="space-y-2">
            {values.map((value: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-2"
              >
                <ComboboxField
                  control={control}
                  name={`${String(name)}.${index}` as FieldPath<TFieldValues>}
                  label={values.length > 0 ? label : ""}
                  required={values.length > 0 ? required : false}
                  disabled={disabled}
                  placeholder={placeholder}
                  searchPlaceholder={searchPlaceholder}
                  noResultsMsg={noResultsMsg}
                  useFilterItems={useFilterItems}
                  useGetItem={useGetItem}
                  className={cn(className)}
                />
                <Button
                  type="button"
                  variant="flat"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                  className="-ml-1 h-10 p-0"
                >
                  <DeleteIcon className="h-6 w-6" />
                </Button>
              </div>
            ))}
            <TFormItem
              label={values.length > 0 ? "" : label}
              required={values.length > 0 ? false : required}
            >
              <div className="flex w-[21.25rem]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAdd}
                  disabled={disabled}
                  className="h-8"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  {addButtonTitle ?? "Add"}
                </Button>
              </div>
            </TFormItem>
          </div>
        );
      }}
    />
  );
};

export default MultiComboboxField;
