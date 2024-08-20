"use client";

import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTakeQuest } from "@/components/hooks/take-quest";
import { api } from "@/trpc/react";

export function Profile() {
  const { data: session } = useSession();
  const userScore = api.quest.getUserScore.useQuery();
  const maxScore = api.quest.getMaxScore.useQuery();

  const percentage = (userScore.data / maxScore.data) * 100;

  // Determine the color class based on percentage
  let colorClass = "text-red-200";

  if (percentage > 0 && percentage <= 20) {
    colorClass = "text-orange-200";
  } else if (percentage > 20 && percentage <= 40) {
    colorClass = "text-yellow-200";
  } else if (percentage > 40 && percentage <= 60) {
    colorClass = "text-yellow-300";
  } else if (percentage > 60 && percentage <= 80) {
    colorClass = "text-green-200";
  } else if (percentage > 80 && percentage <= 100) {
    colorClass = "text-green-300";
  }

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
            <span className={`mt-3 text-2xl font-black ${colorClass}`}>
              {userScore.data}/{maxScore.data} ppt
            </span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
