"use client";

import { type FormEventHandler } from "react";
import { type UseFormReturn } from "react-hook-form";

import { HFormItem } from "@/app/_components/common/form/h-form";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  userRoleMapping,
  type UserFormType,
  type UserRoleType,
  UserRoleSchema,
} from "@/types/user";

interface UserEditPanelProps {
  form: UseFormReturn<UserFormType>;
  title: string;
  canUpdateInfo?: boolean;
  children?: React.ReactNode;
  onSubmit: FormEventHandler;
}

const roleDescription: Record<UserRoleType, string> = {
  admin: "Manage members and eBLs.",
  operator: "Manage eBLs.",
  viewonly: "View only.",
};

const UserEditPanel = ({
  title,
  form,
  canUpdateInfo,
  children,
  onSubmit,
}: UserEditPanelProps) => {
  return (
    <div className="my-[1.875rem] flex flex-col rounded-lg border border-solid border-border-light bg-white text-sm leading-4 text-main shadow-lg">
      <div className="flex w-full justify-between gap-5 px-[1.875rem] py-[1.125rem] text-lg font-semibold leading-[1.625rem]">
        <div>{title}</div>
      </div>
      <Form {...form}>
        <form className="flex flex-col gap-5 pt-8" onSubmit={onSubmit}>
          <div className="flex w-[34rem] flex-col pl-7 pr-3.5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <HFormItem label="Name" required={true}>
                  <Input
                    className={cn(
                      "h-10 w-[21.25rem] shadow-inner",
                      form.formState.errors.name && "!border-warning",
                    )}
                    {...field}
                    {...{ disabled: canUpdateInfo ? undefined : true }}
                  />
                </HFormItem>
              )}
            />
          </div>
          <div className="flex w-[34rem] flex-col pl-7 pr-3.5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <HFormItem label="Email" required={true}>
                  <Input
                    className={cn(
                      "h-10 w-[21.25rem] shadow-inner",
                      form.formState.errors.email && "!border-warning",
                    )}
                    {...field}
                    {...{ disabled: canUpdateInfo ? undefined : true }}
                  />
                </HFormItem>
              )}
            />
          </div>
          <div className="flex w-[34rem] flex-col pl-7 pr-3.5">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <HFormItem label="Role" required={true}>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {UserRoleSchema.options.map((role) => (
                      <div
                        key={role}
                        className="flex w-[21.25rem] items-start space-x-2"
                      >
                        <RadioGroupItem
                          className="mt-0.5"
                          value={role}
                          id={role}
                        />
                        <div className="flex flex-col">
                          <Label
                            htmlFor={role}
                            className="text-[0.8125rem] font-semibold leading-[1.125rem] text-main"
                          >
                            {userRoleMapping[role]}
                          </Label>
                          <Label
                            htmlFor={role}
                            className="text-[0.8125rem] font-normal leading-[1.125rem] text-light"
                          >
                            {roleDescription[role]}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </HFormItem>
              )}
            />
          </div>

          {children}
        </form>
      </Form>
    </div>
  );
};

export default UserEditPanel;
