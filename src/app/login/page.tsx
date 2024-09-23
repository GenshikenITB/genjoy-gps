import { getServerAuthSession } from "@/server/auth";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";
import { SignInButton } from "./page.client";
import Image from "next/image";

export default async function SignIn() {
  const session = await getServerAuthSession();

  if (session) {
    return redirect("/");
  }
  const providers = await getProviders();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 px-5">
      <div className="flex flex-col items-center">
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
      {providers &&
        Object.values(providers).map((provider) => (
          <SignInButton key={provider.name} provider={provider} />
        ))}
    </div>
  );
}
