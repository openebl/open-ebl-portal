"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { UserFormSchema, type UserFormType } from "@/types/user";
import UserEditPanel from "./user-edit-panel";

const UserInviteSection = () => {
  const router = useRouter();
  const form = useForm<UserFormType>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: { name: "", email: "", role: "viewonly" },
  });
  const mutation = api.user.invite.useMutation({
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to update user info: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("User info updated successfully");
      router.push("/settings/users", { scroll: true });
      router.refresh();
    },
  });
  const loading = mutation.isLoading;
  const onSubmit = form.handleSubmit(async (values) => {
    mutation.mutate(values);
  });

  return (
    <UserEditPanel
      title="Invite User"
      form={form}
      canUpdateInfo={true}
      onSubmit={onSubmit}
    >
      {/* Action Panel */}
      <div className="flex h-[5.25rem] w-full items-center justify-end border-t-[1px] border-[#D9D9D9] px-[1.875rem]">
        <div className="flex gap-4">
          <Link href="/settings/users">
            <Button
              variant="outline"
              size="lg"
              className="w-[11.25rem]"
              type="button"
              loading={loading}
            >
              Cancel
            </Button>
          </Link>

          <Button
            size="lg"
            className="w-[11.25rem]"
            type="submit"
            loading={loading}
          >
            Invite
          </Button>
        </div>
      </div>
    </UserEditPanel>
  );
};

export default UserInviteSection;
