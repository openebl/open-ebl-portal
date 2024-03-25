import "@/styles/globals.css";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NextTopLoader from "nextjs-toploader";

import OuterFrame from "@/app/_components/outer-frame";
import { getServerAuthSession } from "@/server/auth";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";

export const metadata = {
  title: "BlueX eBL Portal",
  description: "BlueX e-Bill of Lading Portal",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <NextTopLoader />
        <TRPCReactProvider cookies={cookies().toString()}>
          <OuterFrame session={session}>{children}</OuterFrame>
        </TRPCReactProvider>
        <Toaster theme='light' position='top-center' richColors={true} />
      </body>
    </html>
  );
};

export default RootLayout;
