import { getServerAuthSession } from "@/server/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { VerifyClientPage } from "./page.client";

export default async function Verify() {
  const session = await getServerAuthSession();
  if (session?.user.role === Role.MENTEE) {
    return redirect("/");
  }

  return <VerifyClientPage />;
}
