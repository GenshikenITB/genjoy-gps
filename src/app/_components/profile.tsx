"use client";

import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useSession } from "next-auth/react";

export function Profile() {
  const { data: session } = useSession();

  return (
    <Card className="h-46 bg-secondary">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative h-20 w-20 flex-grow-0 rounded bg-gray-600">
            <Image
              src={session?.user.image ?? "/avatar.png"}
              alt="Profile Picture"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
          <div className="flex h-full flex-col justify-center text-right">
            <span className="text-lg font-bold">{session?.user.name}</span>
            <span className="text-sm font-light italic text-muted-foreground">
              {session?.user.email}
            </span>
            <span className="mt-3 text-2xl font-black text-green-300">
              87,000 ppt
            </span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
