import { redirect } from "next/navigation";

import SigninTemplate from "@/app/_components/signin/signin-template";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";

export default async function SignIn() {
  const session = await getServerAuthSession();

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    redirect("/");
  }

  return (
    <SigninTemplate>
      <div className="flex flex-col justify-between text-center font-header text-[0.8125rem] leading-[1.125rem] h-full">
        <div className="mt-[3.75rem] px-3">
          A link has been sent to your email. Please check your inbox and click
          the link within <strong>15 minutes</strong> to sign in to BlueX Open
          eB/L.
        </div>
        <div>
          {"Didn't receive an email? Click "}
          <Link href="/api/auth/signin" className="font-semibold">here</Link>
          {" to enter your email address again."}
        </div>
      </div>
    </SigninTemplate>
  );
}
