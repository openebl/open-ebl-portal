"use server";

import PenIcon from "@/app/_icons/pen-icon";
import Link from "next/link";

interface UserInfoProps {
  name: string;
  email: string;
}

function UserInfoItem({
  label,
  value,
  separator,
}: {
  label: string;
  value: string;
  separator?: boolean;
}) {
  return (
    <div className="flex w-full flex-col pl-7 pr-3.5 pt-5">
      <div className="flex gap-5">
        <div className="my-auto w-1/3 max-w-[21rem]">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
      {separator ? (
        <div className="mt-5 h-px shrink-0 bg-border-light" />
      ) : (
        <div className="mt-5 h-px shrink-0" />
      )}
    </div>
  );
}

const UserInfoPanel = ({ name, email }: UserInfoProps) => {
  return (
    <div className="mx-[3.125rem] my-[1.875rem] flex flex-col rounded-lg border border-solid border-border-light bg-white text-sm leading-4 text-main shadow-lg">
      <div className="flex w-full justify-between gap-5 px-[1.875rem] py-[1.125rem] text-lg font-semibold leading-[1.625rem]">
        <div>User Info</div>
        <Link href="/settings/user-info/edit">
          <div className="hover:bg-hover active:bg-press flex h-8 w-8 select-none items-center justify-center rounded-[16px] bg-transparent">
            <PenIcon />
          </div>
        </Link>
      </div>
      <UserInfoItem label="Name" value={name} separator={true} />
      <UserInfoItem label="Email Address" value={email} />
    </div>
  );
};

export default UserInfoPanel;
