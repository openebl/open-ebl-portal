import "@/styles/globals.css";

import { redirect } from "next/navigation";

import OuterFrame from "@/app/_components/outer-frame";
import { getServerAuthSession } from "@/server/auth";

export const metadata = {
  title: "BlueX eBL Portal",
  description: "BlueX e-Bill of Lading Portal",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return <OuterFrame session={session}>{children}</OuterFrame>;
};

export default RootLayout;
