"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle, Trophy } from "lucide-react";
import { api } from "@/trpc/react";
import Image from "next/image";

export function LeaderboardClientPage() {
  const users = api.mamet.getAllUsersScore.useQuery();

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
          {users.isLoading ? (
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
          ) : (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {users.data?.map((user, index) => (
                <motion.div
                  key={user.userId}
                  className="mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="flex items-center p-4">
                      <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {index === 0 ? (
                          <Trophy className="h-5 w-5" />
                        ) : (
                          <span className="font-bold">{index + 1}</span>
                        )}
                      </div>
                      <Image
                        src={user.image!}
                        alt={user.name!}
                        width={40}
                        height={40}
                        className="mr-4 rounded-full"
                      />
                      <div className="flex-grow">
                        <p>{user.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {user.score} pts
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </AnimatePresence>
    </Card>
  );
}
