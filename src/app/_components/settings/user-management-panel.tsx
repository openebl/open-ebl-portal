"use server";

import Link from "next/link";

import CircleInCheckIcon from "@/app/_icons/check-in-circle-icon";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/server";
import { userRoleMapping } from "@/types/user";

const UserList = async () => {
  const users = await api.user.list.query();

  return (
    <Table className="font-[0.8125rem] leading-[1.125rem] text-main">
      <TableHeader>
        <TableRow className="bg-background font-[0.8125rem] leading-[1.125rem] text-main">
          <TableHead className="px-[1.875rem]">Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="min-w-[6rem]">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={index} className="h-[3.75rem] cursor-pointer">
            <TableCell className="px-[1.875rem]">{user.name}</TableCell>
            <TableCell>
              {user.userRoles.map((r) => userRoleMapping[r.role]).join(" / ")}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {user.emailVerified ? (
                <div className="flex gap-1">
                  <CircleInCheckIcon className="text-[#42BE25]" />
                  Active
                </div>
              ) : (
                <div>
                  Invitation Sent. <Link href="#">Resend Invitation</Link>.
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const UserManagementPanel = () => {
  return (
    <div className="mx-[3.125rem] my-[1.875rem] flex flex-col rounded-lg border border-solid border-border-light bg-white text-sm leading-4 text-main shadow-lg">
      <div className="flex w-full items-center justify-between px-[1.875rem] py-[1.125rem] text-lg font-semibold leading-[1.625rem]">
        <div>Users</div>
        <Link href="/settings/user-management/invite">
          <Button size="lg" className="w-[7.5rem]">
            Invite
          </Button>
        </Link>
      </div>
      <UserList />
    </div>
  );
};

export default UserManagementPanel;
