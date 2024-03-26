"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/app/_components/dialogs/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { UserFormSchema, type UserFormType } from "@/types/user";
import UserEditPanel from "./user-edit-panel";

type UserInviteSectionProps = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewonly";
};

const UserInviteSection = ({
  id,
  name,
  email,
  role,
}: UserInviteSectionProps) => {
  const router = useRouter();
  const [confirmDeletionOpen, setConfirmDeletionOpen] = useState(false);
  const form = useForm<UserFormType>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: { name, email, role },
  });

  const mutation = api.user.updateRole.useMutation({
    onError: (error) => {
      setConfirmDeletionOpen(false);
      console.error(error);
      toast.error(`Failed to update user role: ${error.message}`);
    },
    onSuccess: () => {
      setConfirmDeletionOpen(false);
      toast.success("User role updated successfully");
      router.push("/settings/users", { scroll: true });
      router.refresh();
    },
  });

  const deleteMutation = api.user.delete.useMutation({
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to delete user: ${error.message}`);
    },
    onSuccess: () => {
      toast.success(`User ${name} deleted successfully`);
      router.push("/settings/users", { scroll: true });
      router.refresh();
    },
  });

  const loading = deleteMutation.isLoading || mutation.isLoading;

  const onSubmit = form.handleSubmit(async (values) => {
    mutation.mutate({ id, role: values.role });
  });

  const onDeleteClicked = () => {
    setConfirmDeletionOpen(true);
  };

  const deleteUser = () => {
    deleteMutation.mutate(id);
  };

  return (
    <>
      <UserEditPanel title="Invite User" form={form} onSubmit={onSubmit}>
        {/* Action Panel */}
        <div className="flex h-[5.25rem] w-full items-center justify-between border-t-[1px] border-[#D9D9D9] px-[1.875rem]">
          <Button
            size="lg"
            className="w-[11.25rem]"
            type="button"
            loading={loading}
            onClick={onDeleteClicked}
          >
            Delete
          </Button>

          <div className="flex gap-4">
            <Link href="/settings/users" tabIndex={-1}>
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
              OK
            </Button>
          </div>
        </div>
      </UserEditPanel>

      <ConfirmationDialog
        open={confirmDeletionOpen}
        state={loading ? "waiting" : "confirm"}
        content={{
          confirm: {
            title: "Are you sure you want to delete this user?",
          },
          waiting: {
            message: "Deleting...",
          },
        }}
        onCancel={() => setConfirmDeletionOpen(false)}
        onConfirm={deleteUser}
      />
    </>
  );
};

export default UserInviteSection;
