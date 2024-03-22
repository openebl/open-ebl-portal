"use client";

import PenIcon from "@/app/_icons/pen-icon";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HFormItem } from "@/app/_components/common/form/h-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserInfoProps {
  name: string;
  email: string;
}

const UserInfoFormSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
});

type UserInfoFormType = z.infer<typeof UserInfoFormSchema>;

const UserInfoEditPanel = (props: UserInfoProps) => {
  const router = useRouter();
  const form = useForm<UserInfoFormType>({
    resolver: zodResolver(UserInfoFormSchema),
    defaultValues: props,
  });
  const mutation = api.user.updateInfo.useMutation({
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to update user info: ${error.message}`);
    } ,
    onSuccess: () => {
      toast.success("User info updated successfully");
      router.push("/settings/user-info", { scroll: true });
      router.refresh();
    },
  });
  const onSubmit = form.handleSubmit(async (values) => {
    mutation.mutate(values);
  });

  return (
    <div className="my-[1.875rem] flex flex-col rounded-lg border border-solid border-border-light bg-white text-sm leading-4 text-main shadow-lg">
      <div className="flex w-full justify-between gap-5 px-[1.875rem] py-[1.125rem] text-lg font-semibold leading-[1.625rem]">
        <div>Edit User Info</div>
      </div>
      <Form {...form} >
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
                    disabled
                    className={cn(
                      "h-10 w-[21.25rem] shadow-inner",
                      form.formState.errors.email && "!border-warning",
                    )}
                    {...field}
                  />
                </HFormItem>
              )}
            />
          </div>

          <div className="flex h-[5.25rem] w-full items-center justify-end border-t-[1px] border-[#D9D9D9] px-[1.875rem]">
            <div className="flex gap-4">
              <Link href="/settings/user-info">
                <Button variant="outline" size="lg" className="w-[11.25rem]" type="button">
                  Cancel
                </Button>
              </Link>

              <Button size="lg" className="w-[11.25rem]" type="submit">
                OK
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserInfoEditPanel;
