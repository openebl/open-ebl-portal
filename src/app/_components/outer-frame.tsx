import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";

const AvatarButton = ({ session }: { session: Session | null }) => {
  if (!session) return null;

  const nameInitial = session?.user.name?.[0] ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage />
          <AvatarFallback>{nameInitial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-header">
        <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
        <DropdownMenuLabel>({session.user.email})</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/api/auth/signout">Sign out</Link>
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

const OuterFrame = async ({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) => {
  return (
    <main className="relative mx-auto h-full min-h-screen min-w-[1280px] bg-background font-header">
      <div className="flex h-16 w-full items-center justify-between bg-header text-header-text">
        <div className="mx-12 flex items-center justify-start">
          {/* <Link href="/">
            <Image
              alt="BlueX Logo"
              src="/bluex-logo.svg"
              width={82}
              height={20}
            />
          </Link> */}
          <Link href="/">
            <div className="mx-0 text-lg font-semibold text-header-text">
              Open eBL
            </div>
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
    </main>
  );
};

export default OuterFrame;
