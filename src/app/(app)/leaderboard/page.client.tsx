"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface UserScore {
  userId: string;
  name: string | null;
  image: string | null;
  score: number;
}

export function LeaderboardClientPage({ users }: { users: UserScore[] }) {
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;

    if (percentage <= 0) return "text-red-200";
    if (percentage <= 20) return "text-orange-200";
    if (percentage <= 40) return "text-yellow-200";
    if (percentage <= 60) return "text-yellow-300";
    if (percentage <= 80) return "text-green-200";
    return "text-green-300";
  };

  return (
    <Card className="bg-secondary">
      <CardHeader className="p-4">
        <motion.span
          className="font-black"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          LEADERBOARD
        </motion.span>
      </CardHeader>
      <AnimatePresence mode="wait">
        <CardContent className="px-4">
          {/* {users.isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <CardHeader className="flex items-center justify-center">
                  <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                </CardHeader>
              </Card>
            </motion.div>
          ) : ( */}
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {users.map((user, index) => (
              <motion.div
                key={user.userId}
                className="mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="flex items-center gap-2 p-4">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {index === 0 ? (
                        <Trophy className="h-5 w-5" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    <Avatar>
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name ?? "User"}
                      />
                      <AvatarFallback>
                        {user.name?.charAt(0).toLocaleUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <p>{user.name}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${getScoreColor(user.score, users[0]?.score ?? 0)}`}
                      >
                        {user.score} pts
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          {/* )} */}
        </CardContent>
      </AnimatePresence>
    </Card>
  );
}
