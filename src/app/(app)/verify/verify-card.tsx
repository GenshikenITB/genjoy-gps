"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  CircleHelp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Quest, QuestEnrollment, User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useVerifyPresence } from "@/hooks/verify-presence";
import { useUnverifyPresence } from "@/hooks/unverify-presence";
import { useApproveParticipation } from "@/hooks/approve-participation";
import { useUnapproveParticipation } from "@/hooks/unapprove-participation";
import { useUntakeQuest } from "@/hooks/untake-quest";
import { useTakeQuest } from "@/hooks/take-quest";

export type VerifyCard = QuestEnrollment & {
  quest: Quest;
  user: User;
};

export function VerifyCard({ enrollment }: { enrollment: VerifyCard }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    quest,
    user,
    isActivelyParticipating,
    isPresentVerified,
    isPresent,
    completedAt,
    id,
  } = enrollment;

  const verifyPresence = useVerifyPresence();
  const unverifyPresence = useUnverifyPresence();
  const approveParticipation = useApproveParticipation();
  const unapproveParticipation = useUnapproveParticipation();
  const untakeQuest = useUntakeQuest();
  const takeQuest = useTakeQuest({ quest });

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
                  src={user.image ?? "/default-404.png"}
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
                <div className="mb-2 flex w-full flex-col items-center justify-between text-center md:flex-row">
                  <p className="my-2 text-left text-sm text-muted-foreground">
                    {quest.description}
                  </p>
                  <Badge variant={quest.isHandsOn ? "outline" : "secondary"}>
                    <span className="text-nowrap">
                      {quest.isHandsOn ? "Hands On" : "Non Hands On"}
                    </span>
                  </Badge>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    {isActivelyParticipating === null ? (
                      <>
                        <CircleHelp className="text-yellow-500" />
                        <span className="text-sm text-muted-foreground">
                          Pending Participation
                        </span>
                      </>
                    ) : isActivelyParticipating ? (
                      <>
                        <CheckCircle2 className="text-green-500" />
                        <span className="text-sm">Actively Participating</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="text-red-500" />
                        <span className="text-sm">
                          Not Actively Participating
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    Taken at:{" "}
                    {completedAt
                      ? new Date(completedAt).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>

                {isPresent && (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Proof of Presence:</p>
                      <Badge
                        className={
                          isPresentVerified ? "bg-green-500" : "bg-red-500"
                        }
                      >
                        {isPresentVerified ? "Verified" : "Not Verified"}
                      </Badge>
                    </div>
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
                <div className="mb-2 mt-2 flex w-full flex-col justify-end gap-2 sm:flex-row">
                  {completedAt ? (
                    <Button
                      onClick={() =>
                        untakeQuest.mutate({
                          id: quest.id,
                          userId: user.id,
                        })
                      }
                      disabled={untakeQuest.isPending}
                      className="w-full"
                    >
                      {untakeQuest.isPending
                        ? "Untaking..."
                        : "Untake Mentee Quest"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        takeQuest.mutate({
                          id: quest.id,
                          userId: user.id,
                        })
                      }
                      disabled={takeQuest.isPending}
                      className="w-full"
                    >
                      {takeQuest.isPending ? "Taking..." : "Take Mentee Quest"}
                    </Button>
                  )}
                  {isPresent ? (
                    isPresentVerified ? (
                      <Button
                        variant="destructive"
                        onClick={() => unverifyPresence.mutate(id)}
                        disabled={unverifyPresence.isPending}
                        className="w-full"
                      >
                        {unverifyPresence.isPending
                          ? "Unverifying..."
                          : "Unverify Presence"}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => verifyPresence.mutate(id)}
                        disabled={verifyPresence.isPending}
                        className="w-full"
                      >
                        {verifyPresence.isPending
                          ? "Verifying..."
                          : "Verify Presence"}
                      </Button>
                    )
                  ) : (
                    <Button disabled className="w-full">
                      No proof.
                    </Button>
                  )}
                </div>

                {isActivelyParticipating === null ? (
                  <div className="flex w-full flex-col gap-2 sm:flex-row">
                    <Button
                      onClick={() => approveParticipation.mutate(id)}
                      disabled={approveParticipation.isPending}
                      className="w-full bg-green-500"
                    >
                      {approveParticipation.isPending
                        ? "Approving..."
                        : "Approve Participation"}
                    </Button>
                    <Button
                      onClick={() => unapproveParticipation.mutate(id)}
                      disabled={unapproveParticipation.isPending}
                      className="w-full bg-red-500"
                    >
                      {unapproveParticipation.isPending
                        ? "Unapproving..."
                        : "Unapprove Participation"}
                    </Button>
                  </div>
                ) : isActivelyParticipating ? (
                  <Button
                    variant="destructive"
                    onClick={() => unapproveParticipation.mutate(id)}
                    disabled={unapproveParticipation.isPending}
                    className="w-full"
                  >
                    {unapproveParticipation.isPending
                      ? "Unapproving..."
                      : "Unapprove Participation"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => approveParticipation.mutate(id)}
                    disabled={approveParticipation.isPending}
                    className="w-full"
                  >
                    {approveParticipation.isPending
                      ? "Approving..."
                      : "Approve Participation"}
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
