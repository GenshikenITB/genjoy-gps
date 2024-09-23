"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SideQuestCard } from "./side-quest-card";
import { api } from "@/trpc/react";
import { LoaderCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSortedItems } from "@/hooks/sort-query";

export function SideQuestAvailable() {
  const quests = api.quest.getAllNotTakenSideQuests.useQuery();
  const sortedQuests = useSortedItems(quests.data, "createdAt");

  return (
    <Card className="bg-secondary">
      <CardHeader className="p-4">
        <motion.span
          className="font-black"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          AVAILABLE SIDE QUEST
        </motion.span>
      </CardHeader>
      <AnimatePresence mode="wait">
        <CardContent className="px-4">
          {quests.isLoading && (
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
          {!quests.isLoading && sortedQuests?.length === 0 && (
            <motion.div
              key="no-quests"
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
          {!quests.isLoading && sortedQuests && sortedQuests.length > 0 && (
            <motion.div
              key="quests-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              {sortedQuests.map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <SideQuestCard quest={quest} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </AnimatePresence>
    </Card>
  );
}
