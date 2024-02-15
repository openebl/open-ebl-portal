"use client";

import { Button } from "@/components/ui/button";
import { type ClientSafeProvider, signIn } from "next-auth/react";

export default function SigninWith({
  provider,
}: {
  provider: ClientSafeProvider;
}) {
  return (
    <div key={provider.name}>
      <Button
        // variant={provider.id === 'google' ? 'outline' : 'default'}
        className="w-full px-8"
        onClick={() => {
          signIn(provider.id).catch(console.error);
        }}
      >
        {/* {provider.id === "google" && (
        <GoogleIcon className="mr-2 h-5 w-5" />
      )} */}
        Sign in with {provider.name}
      </Button>
    </div>
  );
}
