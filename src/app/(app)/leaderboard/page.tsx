import { getServerAuthSession } from "@/server/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { LeaderboardClientPage } from "./page.client";

export default async function AddQuest() {
  const session = await getServerAuthSession();
  if (!session || session?.user.role !== Role.MAMET) {
    return redirect("/");
  }

  return <LeaderboardClientPage />;
}
