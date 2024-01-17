"use client";

import { type ClientSafeProvider, signIn } from "next-auth/react";
// import GoogleIcon from '@/images/logo/google.svg';

export default function SigninWith({
  provider,
}: {
  provider: ClientSafeProvider;
}) {
  return (
    <div key={provider.name}>
      <button
        // variant={provider.id === 'google' ? 'outline' : 'default'}
        className="w-full"
        onClick={() => {
          signIn(provider.id).catch(console.error);
        }}
      >
        {/* {provider.id === "google" && (
        <GoogleIcon className="mr-2 h-5 w-5" />
      )} */}
        Sign in with {provider.name}
      </button>
    </div>
  );
}
