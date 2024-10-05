import { redirect } from "next/navigation";
import { Profile } from "./_components/profile";
import { SideQuestAvailable } from "./_components/side-quest-available";
import { SideQuestTaken } from "./_components/side-quest-taken";
import { getServerAuthSession } from "@/server/auth";
import React from "react";

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/login");
  }

  return (
    <>
      <Profile />
      <SideQuestTaken />
      <SideQuestAvailable />
    </>
  );
}
