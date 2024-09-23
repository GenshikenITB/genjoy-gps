"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { LogOutIcon, Menu, X } from "lucide-react";
import { Role } from "@prisma/client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const session = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavItems = () => (
    <>
      {session.data?.user.role === Role.MAMET && (
        <div className="flex flex-col items-start gap-1 md:flex-row md:items-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <span>Homepage</span>
            </Button>
          </Link>
          <Link href="/add-quest">
            <Button variant="ghost" size="sm">
              <span>Add Quest</span>
            </Button>
          </Link>
          <Link href="/verify">
            <Button variant="ghost" size="sm">
              <span>Verify</span>
            </Button>
          </Link>
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut()}
        className="space-x-2"
      >
        <span>Sign Out</span>
        <LogOutIcon size={15} />
      </Button>
    </>
  );

  return (
    <Card className="bg-secondary">
      <nav className="flex w-full items-center justify-between px-5 py-3">
        <div className="flex w-full items-center justify-between gap-5">
          <Link href="/">
            <Image
              src="/genlogo-dark.svg"
              width={100}
              height={17}
              alt="Genshiken"
            />
          </Link>
          <div className="hidden md:flex md:items-center md:gap-5">
            <NavItems />
          </div>
        </div>
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <AnimatePresence initial={false} mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden md:hidden"
          >
            <div className="border-t border-gray-200 px-5 py-3 dark:border-gray-700">
              <div className="flex flex-col gap-4">
                <NavItems />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
