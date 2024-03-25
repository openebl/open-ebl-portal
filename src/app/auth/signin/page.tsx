import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SigninTemplate from "@/app/_components/signin/signin-template";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";

export default async function SignIn() {
  const session = await getServerAuthSession();

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    redirect("/");
  }

  const cookieStore = cookies();
  const token = cookieStore.get("next-auth.csrf-token");
  const csrfToken = token?.value.split("|")[0];

  return (
    <SigninTemplate>
      <form
        method="POST"
        action="/api/auth/signin/email"
        className="flex w-full flex-col"
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email address"
          aria-label="Email address"
          className="mt-16 justify-center rounded-lg border border-solid border-border-dark bg-background px-4 py-3 text-sm leading-4 text-main shadow-sm"
        />
        <Button
          type="submit"
          className="my-5 h-[2.75rem] px-16 py-3 text-sm leading-5 text-white"
        >
          Sign In
        </Button>
      </form>
    </SigninTemplate>
  );
}
