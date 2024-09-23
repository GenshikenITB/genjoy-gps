"use client";
import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { LogOutIcon } from "lucide-react";
import { type Session } from "next-auth";
import { Role } from "@prisma/client";

export function Navbar() {
  const session = useSession();
  return (
    <Card className="bg-secondary">
      <nav className="flex w-full items-center justify-between px-5 py-3">
        <div className="flex w-full items-center justify-between gap-5">
          <a href="/">
            <Image
              src="/genlogo-dark.svg"
              width={100}
              height={17}
              alt="Genshiken"
            />
          </a>
          {session.data?.user.role === Role.MAMET && (
            <div className="flex items-end">
              <Button variant="ghost" size="sm">
                <span>Add Quest</span>
              </Button>
              <Button variant="ghost" size="sm">
                <span>Verify</span>
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut()}
            className="space-x-2"
          >
            <span>Sign Out</span>
            <LogOutIcon size={15} />
          </Button>
        </div>
      </nav>
    </Card>
  );
}
