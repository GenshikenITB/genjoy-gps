"use client";

import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export function Profile() {
  const { data: session } = useSession();
  const userScore = api.quest.getUserScore.useQuery();
  const maxScore = api.quest.getMaxScore.useQuery();

  const [displayedScore, setDisplayedScore] = useState(0);
  const previousScoreRef = useRef(0);

  useEffect(() => {
    if (!userScore.isPending && userScore.data !== undefined) {
      const newScore = userScore.data;
      const previousScore = previousScoreRef.current;
      const scoreDiff = newScore - previousScore;
      const increment = scoreDiff / 50;

      let currentScore = previousScore;

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

      previousScoreRef.current = newScore;

      return () => clearInterval(timer);
    }
  }, [userScore.isPending, userScore.data]);

  let percentage = 0;
  if (userScore.data !== undefined && maxScore.data !== undefined) {
    percentage = (userScore.data / maxScore.data) * 100;
  }

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

  const isLoading = !session || userScore.isPending || maxScore.isPending;

  return (
    <Card className="bg-secondary">
      <CardHeader className="p-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between gap-4"
            >
              <div className="relative h-24 w-24 flex-grow-0 rounded bg-gray-600">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="flex h-full flex-col items-end justify-end gap-2">
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-8 w-[100px]" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="loaded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between gap-4"
            >
              <motion.div
                className="relative h-24 w-24 flex-grow-0 overflow-hidden rounded bg-gray-600"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Image
                  src={session?.user.image ?? "/404.png"}
                  alt="Profile Picture"
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </motion.div>
              <div className="flex h-full flex-col justify-center text-right">
                <motion.span
                  className="text-lg font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {session?.user.name} - {session.user.role}
                </motion.span>
                <motion.span
                  className="text-sm font-light italic text-muted-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {session?.user.email}
                </motion.span>
                <motion.span
                  className={`mt-3 text-2xl font-black ${colorClass}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.4,
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                  }}
                >
                  {displayedScore.toFixed(1)} ppt
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>
    </Card>
  );
}
