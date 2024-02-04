import { getServerSession } from "next-auth/next";
import { getProviders, signIn } from "next-auth/react";
import { redirect } from "next/navigation";

// import GoogleIcon from "@/images/logo/google.svg";
import { authOptions } from "@/server/auth";
import SigninWith from "@/app/_components/signin-with";

export default async function SignIn() {
  const session = await getServerSession(authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    redirect("/");
  }

  const providers = (await getProviders()) ?? [];

  return (
    <>
      <section>
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          <div className="w-full rounded-lg bg-gray-900 p-10 shadow sm:max-w-md md:mt-0 xl:p-0 dark:border">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              {Object.values(providers).map((provider, index) => (
                <SigninWith key={index} provider={provider} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
