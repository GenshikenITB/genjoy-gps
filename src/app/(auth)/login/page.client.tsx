"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { FaDiscord } from "react-icons/fa";

export function SignInButton() {
  const error = useSearchParams().get("error");
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        onClick={() => signIn("discord")}
        className="flex w-fit items-center justify-center rounded-md border border-transparent bg-[#5865F2] px-4 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#4752C4] focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2"
      >
        <FaDiscord className="mr-2 h-5 w-5" />
        Sign in with Discord
      </Button>

      {error && (
        <div
          className="rounded-md border border-destructive bg-destructive/15 px-4 py-2 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
