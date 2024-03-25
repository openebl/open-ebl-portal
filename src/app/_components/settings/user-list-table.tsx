"use client";

import { api } from "@/trpc/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import CircleInCheckIcon from "@/app/_icons/check-in-circle-icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRoleSchema, userRoleMapping } from "@/types/user";
import { type User } from "@prisma/client";

type UserType = User & {
  userRoles: {
    role: string;
  }[];
};

const ResendInvitationLink = ({ userId }: { userId: bigint }) => {
  const mutation = api.user.sendInvitation.useMutation({
    onSuccess: () => {
      toast.success("Invitation sent successfully");
    },
    onError: (error) => {
      toast.error(`Failed to send invitation: ${error.message}`);
    },
  });

  return mutation.isLoading ? (
    <div className="text-warning">Sending...</div>
  ) : (
    <Link
      href="#"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        mutation.mutate({ id: userId });
      }}
    >
      Resend Invitation
    </Link>
  );
};

const UserList = ({ users }: { users: UserType[] }) => {
  const router = useRouter();
  return (
    <Table className="font-[0.8125rem] leading-[1.125rem] text-main">
      <TableHeader>
        <TableRow className="bg-background font-[0.8125rem] leading-[1.125rem] text-main">
          <TableHead className="px-[1.875rem]">Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="min-w-[6rem] max-w-[10rem]">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow
            key={index}
            className="h-[3.75rem] cursor-pointer"
            onClick={() => router.push(`/settings/users/${user.id}`)}
          >
            <TableCell className="px-[1.875rem]">{user.name}</TableCell>
            <TableCell>
              {user.userRoles
                .map((r) => userRoleMapping[UserRoleSchema.parse(r.role)])
                .join(" / ")}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="max-w-[10rem]">
              {user.emailVerified ? (
                <div className="flex gap-1">
                  <CircleInCheckIcon className="text-[#42BE25]" />
                  Active
                </div>
              ) : (
                <div className="flex gap-1">
                  Invitation Sent. <ResendInvitationLink userId={user.id} />
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserList;
