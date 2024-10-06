"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { AddQuestDialog } from "./form-quest";
import { api } from "@/trpc/react";
import { useSortedItems } from "@/hooks/sort-query";
import { SideQuestCard } from "../_components/side-quest-card";
import { useState } from "react";
import type { Quest } from "@prisma/client";

export function AddQuestClientPage() {
  const quests = api.mamet.getQuests.useQuery();
  const sortedQuests = useSortedItems(quests.data, "id");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest>();

  const openDialog = (quest: Quest) => {
    setEditingQuest(quest);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setEditingQuest(undefined);
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
          ADD SIDE QUEST
        </motion.span>
      </CardHeader>
      <AnimatePresence mode="wait">
        <CardContent className="px-4">
          <AddQuestDialog
            quest={editingQuest}
            isOpen={isDialogOpen}
            isEditing={isEditing}
            setIsOpen={setIsDialogOpen}
            setIsEditing={setIsEditing}
            setEditingQuest={setEditingQuest}
            closeDialog={closeDialog}
          />
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
          {!quests.isLoading && sortedQuests.length === 0 && (
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
                    No presence to verify
                  </span>
                </CardHeader>
              </Card>
            </motion.div>
          )}
          {!quests.isLoading && sortedQuests.length > 0 && (
            <motion.div
              key="quests-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {sortedQuests.map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <SideQuestCard
                    quest={quest}
                    openDialog={openDialog}
                    isMamet
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </AnimatePresence>
    </Card>
  );
}
