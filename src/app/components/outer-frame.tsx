import { getServerAuthSession } from "@/server/auth";
import { type Session } from "next-auth";
import Image from "next/image";

const Avatar = ({ session }: { session: Session | null }) => {
  if (!session) return null;

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white bg-opacity-10 text-[.8125rem] font-semibold">
      TH

      {/* <Link href={session ? "/api/auth/signout" : "/api/auth/signin"} >
          {session ? "Sign out" : "Sign in"}
        </Link> */}
    </div>
  );
};

const Menu = ({ session }: { session: Session | null }) => {
  if (!session) return null;

  return (
    <div className="flex h-[3.875rem] items-center border-b-4 border-[#059CF1]">
    <div className="text-[13px] font-semibold leading-[18px]">
      eB/L
    </div>
  </div>
);
};

const OuterFrame = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerAuthSession();

  return (
    <main className="relative mx-auto h-full min-h-svh w-[1280px] bg-background font-header">
      <div className="flex h-16 w-full items-center justify-between bg-header text-header-text">
        <div className="mx-[3.125rem] flex items-center justify-start">
          <Image
            alt="BlueX Logo"
            src="/bluex-logo.svg"
            width={82}
            height={20}
          />
          <div className="mx-5 text-lg font-semibold">Open eB/L</div>
          <div className="mx-20">
            <Menu session={session} />
          </div>
        </div>
        <div className="mx-[3.125rem] h-9 w-9">
          <Avatar session={session} />
        </div>
      </div>

      {children}
    </main>
  );
};

export default OuterFrame;
