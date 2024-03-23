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
import { UserRoleSchema, userRoleMapping } from "@/types/user";

const UserList = async () => {
  const users = await api.user.list.query();

  return (
    <Table className="font-[0.8125rem] leading-[1.125rem] text-main">
      <TableHeader>
        <TableRow className="bg-background font-[0.8125rem] leading-[1.125rem] text-main">
          {/* Add hidden column to create a clickable row */}
          <th key="extra-column" aria-label="Search Engine Links"></th>
          <TableHead className="px-[1.875rem]">Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="min-w-[6rem]">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={index} className="relative h-[3.75rem] cursor-pointer">
            {/* Add hidden column that covers the whole row and make it a link */}
            <td>
              <Link
                href={`/settings/users/${user.id}`}
                aria-label={`/settings/users/${user.id}`}
                className="content absolute left-0 top-0 h-[3.75rem] w-full select-none"
              ></Link>
            </td>
            <TableCell className="px-[1.875rem]">{user.name}</TableCell>
            <TableCell>
              {user.userRoles.map((r) => userRoleMapping[UserRoleSchema.parse(r.role)]).join(" / ")}
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
        <Link href="/settings/users/invite">
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
