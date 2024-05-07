"use server";

import Link from "next/link";
import React from "react";

import { getServerAuthSession } from "@/server/auth";
import { type PermissionType, hasPermission } from "@/server/permissions";

const MainSection = async ({
  tabIndex,
  children,
}: {
  tabIndex: number;
  children: React.ReactNode;
}) => {
  const session = await getServerAuthSession();
  if (!session) return null;

  return (
    <>
      <div className="px-12 pb-8 pt-10 font-content">
        <div className="text-2xl font-bold leading-9 text-main">Settings</div>
      </div>
      <TabPanel current={tabIndex} permissions={session.permissions} />
      {children}
    </>
  );
};

const TabPanel = ({
  current,
  permissions,
}: {
  current: number;
  permissions: PermissionType[];
}) => {
  const menuItems = [
    { label: "User Info", href: "/settings" },
    ...(hasPermission('read:settings/business-info', permissions) ? [{ label: "Business Info", href: "/settings/business-info" }] : []),
    ...(hasPermission('write:settings/users', permissions) ? [{ label: "User Management", href: "/settings/users" }] : []),
  ];

  return (
    <div className="flex flex-col text-xs text-main">
      <div className="flex w-full items-start gap-4 border-b-[1px] border-border-light px-[3.125rem]">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {/* Separator */}
            {index > 0 && (
              <div className="h-[18px] w-px shrink-0 bg-border-light" />
            )}

            {/* Tab Item */}
            <div className="flex select-none flex-col">
              {index === current ? (
                <>
                  <div>{item.label}</div>
                  <div className="mt-2 h-1 shrink-0 rounded bg-secondary1" />
                </>
              ) : (
                <Link className="text-main" href={item.href}>
                  {item.label}
                </Link>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MainSection;
