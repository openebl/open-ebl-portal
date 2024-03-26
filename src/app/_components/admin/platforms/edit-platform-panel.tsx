"use client";

import { type FormEventHandler } from "react";
import { type UseFormReturn } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type PlatformFormType } from "@/types/admin-platform";
import {
  BusinessInfoKeys,
  BusinessInfoTitleMapping,
} from "@/types/business-info";

interface EditPlatformPanelProps {
  form: UseFormReturn<PlatformFormType>;
  title: string;
  canUpdateInfo?: boolean;
  children?: React.ReactNode;
  onSubmit: FormEventHandler;
}

const InputField = ({
  form,
  name,
  label,
  required,
  disabled,
}: {
  form: UseFormReturn<PlatformFormType>;
  name: keyof PlatformFormType;
  label: string;
  required?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div className="flex w-[34rem] flex-col pl-7 pr-3.5">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex items-start justify-between space-y-0">
            <FormLabel className="w-[18rem] flex-none bg-transparent text-[0.8125rem] font-semibold leading-10 text-light">
              {label}
              {required && <span className="ml-1 text-warning">*</span>}
            </FormLabel>
            <div className="flex flex-col">
              <FormControl>
                <Input
                  className={cn(
                    "h-10 w-[40rem] shadow-inner",
                    form.formState.errors[name] && "!border-warning",
                  )}
                  {...field}
                  {...{ disabled }}
                />
              </FormControl>
              <FormMessage className="mx-2" />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

const EditPlatformPanel = ({
  title,
  form,
  canUpdateInfo,
  children,
  onSubmit,
}: EditPlatformPanelProps) => {
  return (
    <div className="my-[1.875rem] flex flex-col rounded-lg border border-solid border-border-light bg-white text-sm leading-4 text-main shadow-lg">
      <div className="flex w-full justify-between gap-5 px-[1.875rem] py-[1.125rem] text-lg font-semibold leading-[1.625rem]">
        <div>{title}</div>
      </div>
      <Form {...form}>
        <form className="flex flex-col gap-5 pt-8" onSubmit={onSubmit}>
          <InputField
            form={form}
            name="name"
            required={true}
            disabled={!canUpdateInfo}
            label="Name"
          />
          <InputField
            form={form}
            name="platformId"
            required={true}
            disabled={!canUpdateInfo}
            label="Business Unit ID"
          />
          {BusinessInfoKeys.map((key) => (
            <InputField
              key={key}
              form={form}
              name={key}
              required={false}
              disabled={!canUpdateInfo}
              label={BusinessInfoTitleMapping[key]}
            />
          ))}
          {children}
        </form>
      </Form>
    </div>
  );
};

export default EditPlatformPanel;
