import { FormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { type TFormItemBuilder } from "./types";
import { hFormItemBuilder } from "./h-form";

type SelectFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  label: string;
  required?: boolean;
  control: Control<TFieldValues>;
  name: TName;
  items: { name: string; value: string }[];
  formItemBuilder?: TFormItemBuilder;
};

const SelectFormField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  required,
  control,
  name,
  items,
  formItemBuilder = hFormItemBuilder,
}: SelectFormFieldProps<TFieldValues, TName>) => {
  const TFormItem = formItemBuilder();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <TFormItem label={label} required={required}>
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
        </TFormItem>
      )}
    />
  );
};

export default SelectFormField;
