"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SideQuestCard } from "./side-quest-card";

export function SideQuestTaken() {
  return (
    <Card className="h-46 bg-secondary">
      <CardHeader className="p-4">
        <span className="font-black">SIDE QUEST TAKEN</span>
      </CardHeader>
      <CardContent className="px-4">
        <SideQuestCard />
      </CardContent>
    </Card>
  );
}
