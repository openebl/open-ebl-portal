"use server";

import Link from "next/link";

const MainSection = ({ tabIndex,children }: { tabIndex: number, children: React.ReactNode }) => {
  return (
    <>
      <div className="px-12 pb-8 pt-10 font-content">
        <div className="text-2xl font-bold leading-9 text-main">Settings</div>
      </div>
      <TabPanel current={tabIndex} />
      {children}
    </>
  );
};

const TabPanel = ({ current }: { current: number }) => {
  const menuItems = [
    { label: "User Info", href: "/settings" },
    { label: "Business Info", href: "/settings/business-info" },
    { label: "User Management", href: "/settings/user-management" },
  ];

  return (
    <div className="flex flex-col text-xs text-main">
      <div className="flex w-full items-start gap-4 border-b-[1px] border-border-light px-[3.125rem]">
        {menuItems.map((item, index) => (
          <>
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
          </>
        ))}
      </div>
    </div>
  );
};

export default MainSection;
