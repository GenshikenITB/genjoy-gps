"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SideQuestCard } from "./side-quest-card";
import { api } from "@/trpc/react";
import { LoaderCircleIcon } from "lucide-react";

export function SideQuestAvailable() {
  const quests = api.quest.getAllNotTakenSideQuests.useQuery();
  return (
    <Card className="h-46 bg-secondary">
      <CardHeader className="p-4">
        <span className="font-black">AVAILABLE SIDE QUEST</span>
      </CardHeader>
      <CardContent className="space-y-2 px-4">
        {quests.isLoading && (
          <Card>
            <CardHeader>
              <LoaderCircleIcon className="animate-spin self-center" />
            </CardHeader>
          </Card>
        )}
        {quests.data?.length === 0 && (
          <Card>
            <CardHeader>
              <span className="text-center">No side quest available</span>
            </CardHeader>
          </Card>
        )}
        {quests.data?.map((quest) => (
          <SideQuestCard key={quest.id} quest={quest} />
        ))}
      </CardContent>
    </Card>
  );
}
