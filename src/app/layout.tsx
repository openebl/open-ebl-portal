import "@/styles/globals.css";

import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

export const metadata = {
  title: "BlueX eBL Portal",
  description: "BlueX e-Bill of Lading Portal",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader color="#2292dd" />
        <TRPCReactProvider cookies={cookies().toString()}>{children}</TRPCReactProvider>
        <Toaster theme="light" position="top-center" richColors={true} />
      </body>
    </html>
  );
}
