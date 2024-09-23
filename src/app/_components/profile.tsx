"use client";

import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export function Profile() {
  const { data: session } = useSession();
  const userScore = api.quest.getUserScore.useQuery();
  const maxScore = api.quest.getMaxScore.useQuery();

  const [displayedScore, setDisplayedScore] = useState(0);
  const previousScoreRef = useRef(0); // Store previous score across renders

  useEffect(() => {
    if (!userScore.isPending && userScore.data !== undefined) {
      const newScore = userScore.data;
      const previousScore = previousScoreRef.current;
      const scoreDiff = newScore - previousScore;
      const increment = scoreDiff / 50; // Controls animation smoothness

      let currentScore = previousScore;

      // Update the displayed score gradually
      const timer = setInterval(() => {
        currentScore += increment;
        setDisplayedScore(() => {
          if (
            (increment > 0 && currentScore >= newScore) ||
            (increment < 0 && currentScore <= newScore)
          ) {
            clearInterval(timer);
            return newScore;
          }
          return currentScore;
        });
      }, 20);

      // Store the new score for the next render cycle
      previousScoreRef.current = newScore;

      return () => clearInterval(timer);
    }
  }, [userScore.isPending, userScore.data]);

  let percentage = 0;
  if (userScore.data !== undefined && maxScore.data !== undefined) {
    percentage = (userScore.data / maxScore.data) * 100;
  }

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

  if (!session || userScore.isPending || maxScore.isPending) {
    return (
      <Card className="bg-secondary">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative h-24 w-24 flex-grow-0 rounded bg-gray-600">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="flex h-full flex-col items-end justify-end gap-2">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-8 w-[100px]" />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-secondary">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative h-24 w-24 flex-grow-0 rounded bg-gray-600">
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
              <motion.span
                className={`mt-3 text-2xl font-black ${colorClass}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {displayedScore.toFixed(1)} ppt
              </motion.span>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Button
        variant="destructive"
        onClick={() => signOut()}
        className="space-x-2"
      >
        <span>Sign Out</span>
        <LogOutIcon size={15} />
      </Button>
    </>
  );
}
