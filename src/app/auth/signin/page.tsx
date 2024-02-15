import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";

import SigninWith from "@/app/_components/signin-with";
import { getServerAuthSession } from "@/server/auth";

export default async function SignIn() {
  const session = await getServerAuthSession();

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
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 h-screen font-header">
          {/* <div className="w-full rounded-lg bg-gray-900 p-10 shadow sm:max-w-md md:mt-0 xl:p-0"> */}
            <div className="space-y-4 p-8 md:space-y-6">
              {Object.values(providers).map((provider, index) => (
                <SigninWith key={index} provider={provider} />
              ))}
            </div>
          {/* </div> */}
        </div>
      </section>
    </>
  );
}
