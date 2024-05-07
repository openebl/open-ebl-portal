import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const HFormItem = ({
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
      {required && <span className="ml-1 text-warning">*</span>}
    </FormLabel>
    <div className="flex flex-col">
      <FormControl>{children}</FormControl>
      <FormMessage className="mx-2" />
    </div>
  </FormItem>
);

const hFormItemBuilder = () => HFormItem;

export { HFormItem, hFormItemBuilder };
