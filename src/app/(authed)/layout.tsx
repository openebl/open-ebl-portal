import "@/styles/globals.css";

import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";


export const metadata = {
  title: "BlueX eBL Portal",
  description: "BlueX e-Bill of Lading Portal",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
// className={`font-sans ${inter.variable}`}