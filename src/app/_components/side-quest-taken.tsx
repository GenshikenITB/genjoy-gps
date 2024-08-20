"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SideQuestCard } from "./side-quest-card";
import { api } from "@/trpc/react";

export function SideQuestTaken() {
  const enrollment = api.quest.getAllTakenSideQuests.useQuery();
  return (
    <Card className="h-46 bg-secondary">
      <CardHeader className="p-4">
        <span className="font-black">SIDE QUEST TAKEN</span>
      </CardHeader>
      <CardContent className="space-y-2 px-4">
        {enrollment.data?.length === 0 && (
          <Card>
            <CardHeader>
              <span className="text-center">No side quest taken</span>
            </CardHeader>
          </Card>
        )}
        {enrollment.data?.map((enrollment) => (
          <SideQuestCard
            key={enrollment.id}
            quest={enrollment.quest}
            enrollment={enrollment}
            isTaken
          />
        ))}
      </CardContent>
    </Card>
  );
}
