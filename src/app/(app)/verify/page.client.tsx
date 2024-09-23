"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { QuestCard } from "./card";
import { useSortedItems } from "@/hooks/sort-query";

export function VerifyClientPage() {
  const enrollments = api.mamet.getAllEnrollments.useQuery();
  const sortedEnrollments = useSortedItems(enrollments.data, "id");

  return (
    <Card className="bg-secondary">
      <CardHeader className="p-4">
        <motion.span
          className="font-black"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          VERIFY PRESENCE
        </motion.span>
      </CardHeader>
      <AnimatePresence mode="wait">
        <CardContent className="px-4">
          {enrollments.isLoading && (
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
          {!enrollments.isLoading && sortedEnrollments.length === 0 && (
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
          {!enrollments.isLoading && sortedEnrollments.length > 0 && (
            <motion.div
              key="quests-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {sortedEnrollments.map((enrollment, index) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <QuestCard enrollment={enrollment} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </AnimatePresence>
    </Card>
  );
}
