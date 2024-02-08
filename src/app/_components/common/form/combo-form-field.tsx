"use client";

import { FormField } from "@/components/ui/form";
import React, { useState } from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { prop, sortBy, uniqBy } from "remeda";
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
  // useFilterItems?: (keyword: string) => { items: ComboBoxItemType[]; loading: boolean, isError: boolean};
  getItem: (value: string) => Promise<ComboBoxItemType | undefined>;
  filterItems: (keyword: string) => Promise<ComboBoxItemType[]>;
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
  noResultsMsg="No results found",
  formItemBuilder = hFormItemBuilder,
  getItem,
  filterItems,
}: ComboboxFieldProps<TFieldValues, TName>) => {
  const TFormItem = formItemBuilder();
  const [currentValue, setCurrentValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ComboBoxItemType[]>([]);
  const [keyword, setKeyword] = useState("");

  React.useEffect(() => {
    const doFetch = async () => {
      // Do nothing if both keyword and currentValue are empty
      if (!keyword && !currentValue) return;

      console.log("fetching", keyword, currentValue);
      setLoading(true);

      // Fetch the current item based on currentValue. build a blank array if getItems returns undefined
      const currentItems = [
        currentValue && (await getItem(currentValue)),
      ].filter(Boolean) as ComboBoxItemType[];

      const filtered = await filterItems(keyword);

      // Merge the fetched items and current item, remove duplicates, sort them by label, and update the items
      setItems(
        sortBy(
          uniqBy([...filtered, ...currentItems], prop("value")),
          prop("label"),
        ),
      );
      setLoading(false);
    };
    doFetch().catch(console.error);
  }, [currentValue, filterItems, getItem, keyword]);

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
            items={items}
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
