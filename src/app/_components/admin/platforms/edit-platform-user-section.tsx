"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type FormEventHandler } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import {
  UserFormSchema,
  UserRoleSchema,
  userRoleMapping,
  type UserFormType,
} from "@/types/user";
import type { User, UserRole } from "@prisma/client";
import { toast } from "sonner";
import AddUserPanel from "./add-user-panel";
import { useRouter } from "next/navigation";

type UserRoleWithUser = UserRole & { user: User };

const AddOrEditUserDialog = ({
  open,
  loading,
  children,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  loading: boolean;
  form: UseFormReturn<UserFormType>;
  onCancel: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="min-h-[220px] min-w-[640px]">
        {children}
        <AlertDialogFooter>
          <AlertDialogAction disabled={loading} onClick={onCancel}>
            Cancel
          </AlertDialogAction>
          <AlertDialogAction disabled={loading} onClick={onConfirm}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ConfirmDeletionDialog = ({
  open,
  loading,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader className="min-w-[500px] py-5">
          <AlertDialogTitle>Remove User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this user from the platform?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction disabled={loading} onClick={onCancel}>
            Cancel
          </AlertDialogAction>
          <AlertDialogAction disabled={loading} onClick={onConfirm}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z"
              clipRule="evenodd"
            />
          </svg>
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

const EditPlatformUserSection = ({
  userRoles,
  platformId,
  platformName,
}: {
  userRoles: UserRoleWithUser[];
  platformId: bigint;
  platformName: string;
}) => {
  const router = useRouter();
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [userAction, setUserAction] = useState<"edit" | "add">("add");
  const [confirmDeletionOpen, setConfirmDeletionOpen] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<bigint | null>(null);
  const [formValues, setFormValues] = useState<UserFormType | undefined>(
    undefined,
  );
  const defaultValues = {
    email: "",
    name: "",
    role: "viewonly",
  } as UserFormType;
  const form = useForm<UserFormType>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: defaultValues,
    values: formValues,
  });

  const mutation = api.adminPlatform.addUser.useMutation({
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to add user: ${error.message}`);
      setAddUserOpen(false);
    },
    onSuccess: () => {
      toast.success("User added successfully");
      router.refresh();
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
      router.refresh();
      setConfirmDeletionOpen(false);
    },
  });

  const loading = mutation.isLoading || removeMutation.isLoading;

  const onSubmit = form.handleSubmit(async (values) => {
    mutation.mutate({ platformId, ...values });
  });

  const onAddUser = () => {
    setUserAction("add");
    setFormValues(defaultValues);
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
    const userRole = userRoles.find((ur) => ur.userId === userId);
    if (userRole) {
      setUserAction("edit");
      setFormValues({
        email: userRole.user.email ?? "",
        name: userRole.user.name ?? "",
        role: UserRoleSchema.parse(userRole.role),
      });
      setAddUserOpen(true);
    }
  };

  const onResendInvite = async (userId: bigint) => {
    resendMutation.mutate({ id: userId });
  }

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
        <div>Platform Users - {platformName}</div>
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
          {userRoles.map((userRole, index) => (
            <TableRow key={index} className="h-[3.75rem] cursor-pointer">
              <TableCell className="px-[1.875rem]">
                {String(userRole.user.id)}
              </TableCell>
              <TableCell>{userRole.user.name}</TableCell>
              <TableCell>{userRole.user.email}</TableCell>
              <TableCell>
                {userRoleMapping[UserRoleSchema.parse(userRole.role)]}
              </TableCell>
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
      <AddOrEditUserDialog
        open={addUserOpen}
        form={form}
        loading={loading}
        onCancel={() => {
          setAddUserOpen(false);
          // set form values to default to clear errors and reset form
          setFormValues({ ...defaultValues, name: " " });
        }}
        onConfirm={addUser}
      >
        <AddUserPanel
          form={form}
          disabled={loading}
          disableEmail={userAction === "edit"}
          onSubmit={onSubmit}
        />
      </AddOrEditUserDialog>
      <ConfirmDeletionDialog
        open={confirmDeletionOpen}
        loading={loading}
        onCancel={() => setConfirmDeletionOpen(false)}
        onConfirm={removeUser}
      />
    </div>
  );
};
export default EditPlatformUserSection;
