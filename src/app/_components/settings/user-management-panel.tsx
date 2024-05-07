"use server";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import UserList from "./user-list-table";


const UserManagementPanel = async () => {
  const users = await api.user.list.query();

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
      <UserList users={users} />
    </div>
  );
};

export default UserManagementPanel;
