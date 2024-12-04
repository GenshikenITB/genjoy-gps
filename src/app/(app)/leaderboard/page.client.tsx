"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { api } from "@/trpc/react";

export function LeaderboardClientPage() {
  const users = api.mamet.getAllEnrollments.useQuery();
  console.log(users);

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
          {users.isLoading && (
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
        </CardContent>
      </AnimatePresence>
    </Card>
  );
}
