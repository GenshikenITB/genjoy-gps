"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SideQuestCard } from "./side-quest-card";
import { api } from "@/trpc/react";
import { LoaderCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSortedItems } from "@/hooks/sort-query";

export function SideQuestTaken() {
  const enrollment = api.quest.getAllTakenSideQuests.useQuery();
  const sortedEnrollments = useSortedItems(enrollment.data, "completedAt");

  return (
    <Card className="bg-secondary">
      <CardHeader className="p-4">
        <motion.span
          className="font-black"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          SIDE QUEST TAKEN
        </motion.span>
      </CardHeader>
      <AnimatePresence mode="wait">
        <CardContent className="px-4">
          {enrollment.isLoading && (
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
          )}
          {!enrollment.isLoading && sortedEnrollments.length === 0 && (
            <motion.div
              key="no-enroll"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <span className="text-center text-muted-foreground">
                    No side quest available
                  </span>
                </CardHeader>
              </Card>
            </motion.div>
          )}
          {!enrollment.isLoading &&
            sortedEnrollments &&
            sortedEnrollments.length > 0 && (
              <motion.div
                key="enroll-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                {sortedEnrollments.map((enroll, index) => (
                  <motion.div
                    key={enroll.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <SideQuestCard quest={enroll.quest} enrollment={enroll} />
                  </motion.div>
                ))}
              </motion.div>
            )}
        </CardContent>
      </AnimatePresence>
    </Card>
  );
}
