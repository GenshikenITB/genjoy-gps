"use client";

import { Button } from "@/components/ui/button";
import { signIn, type ClientSafeProvider } from "next-auth/react";
import { FaDiscord } from "react-icons/fa";

export function SignInButton({ provider }: { provider: ClientSafeProvider }) {
  return (
    <Button
      onClick={() => signIn(provider.id)}
      className="flex w-fit items-center justify-center rounded-md border border-transparent bg-[#5865F2] px-4 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#4752C4] focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2"
    >
      <FaDiscord className="mr-2 h-5 w-5" />
      Sign in with Discord
    </Button>
  );
}
