"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ConfirmationDialog } from "@/app/_components/dialogs/confirmation-dialog";
import ThreeDotIcon from "@/app/_icons/three-dot-icon.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/trpc/react";
import { UserFormSchema, UserRoleSchema, userRoleMapping, type UserFormType } from "@/types/user";
import { toast } from "sonner";
import AddUserPanel from "./add-user-panel";

const UserActionMenu = ({
  onEdit,
  onRemove,
  onResend,
}: {
  onEdit: () => void;
  onRemove: () => void;
  onResend: () => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex h-8 w-8 select-none items-center justify-center rounded-[16px] bg-stone-100 bg-transparent hover:bg-orange-200 active:bg-press">
          <ThreeDotIcon className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-header" align="end">
        <DropdownMenuItem onClick={onEdit}>
          <div className="w-full">Edit</div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onResend}>
          <div className="w-full">Resend Invitation</div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRemove}>
          <div className="w-full">Delete</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const EditPlatformUserSection = ({ platformId }: { platformId: string }) => {
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [userAction, setUserAction] = useState<"edit" | "add">("add");
  const [confirmDeletionOpen, setConfirmDeletionOpen] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<bigint | null>(null);
  const query = api.adminPlatform.getWithUserRoles.useQuery({ id: platformId }, { staleTime: 1000 * 30 });

  const defaultValues = {
    email: "",
    name: "",
    role: "viewonly",
  } as UserFormType;

  const form = useForm<UserFormType>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: defaultValues,
  });

  const mutation = api.adminPlatform.addUser.useMutation({
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to add user: ${error.message}`);
      setAddUserOpen(false);
    },
    onSuccess: () => {
      toast.success("User added successfully");
      query.refetch().catch(console.error);
      setAddUserOpen(false);
    },
  });

  const resendMutation = api.user.sendInvitation.useMutation({
    onError: (error) => {
      toast.error(`Failed to send invitation: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Invitation sent successfully");
    },
  });

  const removeMutation = api.adminPlatform.removeUser.useMutation({
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to remove user: ${error.message}`);
      setConfirmDeletionOpen(false);
    },
    onSuccess: () => {
      toast.success("User removed successfully");
      query.refetch().catch(console.error);
      setConfirmDeletionOpen(false);
    },
  });

  const loading = mutation.isLoading || removeMutation.isLoading;

  const onSubmit = form.handleSubmit(async (values) => {
    mutation.mutate({ platformId, ...values });
  });

  const onAddUser = () => {
    setUserAction("add");
    form.reset(defaultValues);
    setAddUserOpen(true);
  };

  const addUser = async () => {
    const r = await form.trigger(undefined, { shouldFocus: true });
    if (!r) {
      console.error(form.formState.errors);
      return false;
    }
    mutation.mutate({ platformId, ...form.getValues() });
  };

  const onEditUser = async (userId: bigint) => {
    const userRole = query.data?.UserRoles.find((ur) => ur.userId === userId);
    if (userRole) {
      setUserAction("edit");
      form.reset({
        email: userRole.User.email ?? "",
        name: userRole.User.name ?? "",
        role: UserRoleSchema.parse(userRole.role),
      });
      setAddUserOpen(true);
    }
  };

  const onResendInvite = async (userId: bigint) => {
    resendMutation.mutate({ id: userId });
  };

  const onRemoveUser = async (userId: bigint) => {
    setRemovingUserId(userId);
    setConfirmDeletionOpen(true);
  };

  const removeUser = () => {
    if (removingUserId === null) {
      console.error("removingUserId is null");
      return;
    }
    removeMutation.mutate({ userId: removingUserId, platformId });
    setRemovingUserId(null);
  };

  return (
    <div className="my-[1.875rem] flex flex-col rounded-lg border border-solid border-border-light bg-white text-sm leading-4 text-main shadow-lg">
      <div className="flex w-full justify-between gap-5 px-[1.875rem] py-[1.125rem] text-lg font-semibold leading-[1.625rem]">
        <div>Platform Users - {query.data?.name}</div>
        <Button onClick={onAddUser}>Add User</Button>
      </div>

      <Table className="font-[0.8125rem] leading-[1.125rem] text-main">
        <TableHeader>
          <TableRow className="bg-background font-[0.8125rem] leading-[1.125rem] text-main">
            <TableHead className="px-[1.875rem]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {query.data?.UserRoles.map((userRole, index) => (
            <TableRow key={index} className="h-[3.75rem] cursor-pointer">
              <TableCell className="px-[1.875rem]">{String(userRole.User.id)}</TableCell>
              <TableCell>{userRole.User.name}</TableCell>
              <TableCell>{userRole.User.email}</TableCell>
              <TableCell>{userRoleMapping[UserRoleSchema.parse(userRole.role)]}</TableCell>
              <TableCell>
                <UserActionMenu
                  onEdit={() => onEditUser(userRole.userId)}
                  onResend={() => onResendInvite(userRole.userId)}
                  onRemove={() => onRemoveUser(userRole.userId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmationDialog
        open={addUserOpen}
        state={loading ? "waiting" : "confirm"}
        content={{
          confirm: {
            title: userAction === "edit" ? "Edit User" : "Add User",
            message: (
              <AddUserPanel form={form} disabled={loading} disableEmail={userAction === "edit"} onSubmit={onSubmit} />
            ),
          },
          waiting: {
            message: "Updating...",
          },
        }}
        className="min-w-[40rem]"
        onCancel={() => {
          setAddUserOpen(false);
        }}
        onConfirm={addUser}
      />

      {/* delete confirmation dialog */}
      <ConfirmationDialog
        open={confirmDeletionOpen}
        state={loading ? "waiting" : "confirm"}
        content={{
          confirm: {
            title: "Remove User",
            message: "Are you sure you want to remove this user from the platform?",
          },
          waiting: {
            title: "Removing User",
            message: "Removing user from the platform...",
          },
        }}
        onCancel={() => setConfirmDeletionOpen(false)}
        onConfirm={removeUser}
      />
    </div>
  );
};

export default EditPlatformUserSection;
