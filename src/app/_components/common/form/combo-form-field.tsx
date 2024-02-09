"use client";

import { FormField } from "@/components/ui/form";
import { useState } from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { prop, uniqBy } from "remeda";
import { Combobox, type ComboBoxItemType } from "../combobox";
import { hFormItemBuilder } from "./h-form";
import type { TFormItemBuilder } from "./types";

type ComboboxFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  label: string;
  required?: boolean;
  control: Control<TFieldValues>;
  name: TName;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsMsg?: string;
  formItemBuilder?: TFormItemBuilder;
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

const ComboboxField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  required,
  control,
  name,
  placeholder = "Select",
  searchPlaceholder = "Type in Keyword",
  noResultsMsg = "No results found",
  formItemBuilder = hFormItemBuilder,
  useFilterItems,
  useGetItem,
}: ComboboxFieldProps<TFieldValues, TName>) => {
  const TFormItem = formItemBuilder();
  const [currentValue, setCurrentValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const { items, loading, isError } = useFilterItems(keyword);
  const { item } = useGetItem(currentValue);
  const renderItems = uniqBy(
    [...(item ? [item] : []), ...items],
    prop("value"),
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <TFormItem label={label} required={required}>
          <Combobox
            className="h-10 w-[21.25rem]"
            value={field.value}
            onSelect={field.onChange}
            items={renderItems}
            loading={loading}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            noResultsMsg={noResultsMsg}
            onSearchChange={setKeyword}
            onValueChange={setCurrentValue}
          />
        </TFormItem>
      )}
    />
  );
};

export default ComboboxField;
