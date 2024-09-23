"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Quest, QuestEnrollment, User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useApprovePresence } from "@/hooks/approve-presence";
import { useUnapprovePresence } from "@/hooks/unapprove-presence";

export type QuestCardProps = QuestEnrollment & {
  quest: Quest;
  user: User;
};

export function QuestCard({ enrollment }: { enrollment: QuestCardProps }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { quest, user, isActivelyParticipating, isPresent, completedAt, id } =
    enrollment;

  const approve = useApprovePresence(enrollment);
  const unapprove = useUnapprovePresence(enrollment);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">{quest.title}</CardTitle>
            <Badge
              variant={quest.type === "COMMUNITY" ? "default" : "secondary"}
            >
              {quest.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.image ?? "/default-avatar.png"}
                  alt={user.name ?? "Unknown User"}
                />
                <AvatarFallback>
                  {user.name ? user.name.charAt(0) : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary"
            >
              <AnimatePresence initial={false} mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronUp />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex w-full items-center justify-between text-center">
                  <p className="my-4 text-sm text-muted-foreground">
                    {quest.description}
                  </p>
                  <Badge variant={quest.isHandsOn ? "outline" : "secondary"}>
                    {quest.isHandsOn ? "Hands On" : "Non Hands On"}
                  </Badge>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    {isActivelyParticipating ? (
                      <CheckCircle2 className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )}
                    <span className="text-sm">
                      {isActivelyParticipating
                        ? "Actively Participating"
                        : "Not Actively Participating"}
                    </span>
                  </div>
                  <div className="text-right text-sm">
                    Completed:{" "}
                    {completedAt
                      ? new Date(completedAt).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>

                {isPresent && (
                  <>
                    <p className="mb-2 text-sm font-medium">
                      Proof of Presence:
                    </p>
                    <div className="relative mt-4 h-[350px] w-full">
                      <Image
                        src={isPresent}
                        alt="Proof of Presence"
                        fill
                        className="rounded-md object-contain"
                      />
                    </div>
                  </>
                )}
                <div className="mt-4 flex justify-end gap-2">
                  {isActivelyParticipating ? (
                    <Button
                      variant="destructive"
                      onClick={() => unapprove.mutate(id)}
                      disabled={unapprove.isPending}
                    >
                      {unapprove.isPending
                        ? "Unapproving..."
                        : "Unapprove Presence"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => approve.mutate(id)}
                      disabled={approve.isPending}
                    >
                      {approve.isPending ? "Approving..." : "Approve Presence"}
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
