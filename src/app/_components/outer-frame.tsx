"use server";

import { type Session } from "next-auth";
import Link from "next/link";
import { groupBy } from "remeda";

import BlueXLogo from "@/app/_icons/bluex-logo.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/server";
import { PolicyDialog } from "./dialogs/policy-dialog";
import Signout from "./signout";

const AvatarButton = ({ session }: { session: Session | null }) => {
  if (!session) return null;

  const nameInitial = session?.user.name?.[0] ?? "";
  const platforms = groupBy(session.platformRoles, (n) => String(n.platform.id));
  const platformCount = Object.keys(platforms).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage />
          <AvatarFallback>{nameInitial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-header" align="end">
        <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
        <DropdownMenuLabel>({session.user.email})</DropdownMenuLabel>
        <DropdownMenuLabel>[ {session.platform.name} ]</DropdownMenuLabel>
        {platformCount > 1 && (
          <>
            <DropdownMenuSeparator />
            {Object.keys(platforms).map(
              (pid) =>
                BigInt(pid) !== session.platform.id && (
                  <DropdownMenuItem key={pid} asChild>
                    <Link className="w-full" href={`/settings/platforms/${pid}/active`}>
                      Switch to {platforms[pid]?.[0]?.platform.name}
                    </Link>
                  </DropdownMenuItem>
                ),
            )}
          </>
        )}
        {session.platform.admin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link className="w-full" href="/admin">
                Admin
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="w-full" href="/settings">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Signout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Menu = ({ session }: { session: Session | null }) => {
  if (!session) return null;

  return (
    <div className="flex h-[3.875rem] items-center border-b-4 border-[#059CF1]">
      <div className="text-[13px] font-semibold leading-[18px]">eBL</div>
    </div>
  );
};

const OuterFrame = async ({ session, children }: { session: Session | null; children: React.ReactNode }) => {
  const currentYear = new Date().getFullYear();
  const pending = session ? await api.user.pendingAgreements.query() : [];
  const pendingAgreements = await Promise.all(
    pending.map(async (n) => {
      return {
        service: n.service,
        name: n.name,
        version: n.version,
        content: await (await fetch(n.url)).text(),
      };
    }),
  );

  return (
    <main className="mx-auto flex h-full min-h-screen min-w-[1280px] flex-col bg-background font-header">
      <div className="flex h-16 w-full items-center justify-between bg-header text-header-text">
        <div className="mx-12 flex items-center justify-start">
          <Link href="/ebls" tabIndex={-1}>
            <BlueXLogo />
          </Link>
          <Link href="/ebls" tabIndex={-1}>
            <div className="mx-2 text-lg font-semibold text-header-text">Open eBL</div>
          </Link>
          <div className="mx-20">
            <Menu session={session} />
          </div>
        </div>
        <div className="mx-[3.125rem] h-9 w-9">
          <AvatarButton session={session} />
        </div>
      </div>

      {children}

      <div className="flex-1"></div>

      <footer className="flex h-[3.125rem] w-full items-center justify-between bg-white px-[3.125rem] font-content text-xs font-semibold text-main">
        <div>© 2020-{currentYear} All Rights Reserved</div>
        <div>
          <a className="text-main" href="https://www.bluextrade.com/ebl-agreement/" target="_blank" rel="noreferrer">
            Terms of Service
          </a>
          <span className="mx-2">|</span>
          <a
            className="text-main"
            href="https://www.bluextrade.com/bluextrade-privacy-policy/"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
          <span className="mx-2">|</span>
          <a className="text-main" href="https://www.bluextrade.com/cookie-policy/" target="_blank" rel="noreferrer">
            Cookie Policy
          </a>
        </div>
      </footer>

      {pendingAgreements.length > 0 && <PolicyDialog manifests={pendingAgreements} />}
    </main>
  );
};

export default OuterFrame;
