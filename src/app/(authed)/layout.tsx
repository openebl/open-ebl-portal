import "@/styles/globals.css";

import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import OuterFrame from "@/app/_components/outer-frame";
import { getServerAuthSession } from "@/server/auth";

export const metadata = {
  title: "BlueX eBL Portal",
  description: "BlueX e-Bill of Lading Portal",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerAuthSession();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        {/* <style dangerouslySetInnerHTML={{ __html: inter.style }}></style> */}
        <TRPCReactProvider cookies={cookies().toString()}>
          <OuterFrame session={session}>{children}</OuterFrame>
        </TRPCReactProvider>
      </body>
    </html>
  );
};

export default RootLayout;
