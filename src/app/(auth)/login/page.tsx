import { getServerAuthSession } from "@/server/auth";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";
import { SignInButton } from "./page.client";
import Image from "next/image";
import React from "react";

export default async function SignIn() {
  const session = await getServerAuthSession();

  if (session) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      <div className="flex flex-col items-center space-y-2">
        <Image
          src="/genlogo-dark.svg"
          width={180}
          height={31}
          alt="Genshiken"
        />
        <span className="text-muted-foreground">
          Start your Genshiken Journey now!
        </span>
      </div>

      <div className="flex w-full max-w-sm justify-center space-y-4">
        <SignInButton />
      </div>
    </div>
  );
}
