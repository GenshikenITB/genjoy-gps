"use client";

import { Card, CardHeader } from "@/components/ui/card";

export function SideQuestAvailable() {
  return (
    <Card className="h-46 bg-secondary">
      <CardHeader className="p-4">
        <span className="font-black">AVAILABLE SIDE QUEST</span>
      </CardHeader>
    </Card>
  );
}
