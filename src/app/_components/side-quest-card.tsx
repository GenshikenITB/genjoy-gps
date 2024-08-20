import { useTakeQuest } from "@/components/hooks/take-quest";
import { useUntakeQuest } from "@/components/hooks/untake-quest";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import type { Quest } from "@prisma/client";
import { CheckIcon, TrashIcon, UploadIcon } from "lucide-react";

export function SideQuestCard({
  isTaken = false,
  quest,
}: {
  isTaken?: boolean;
  quest?: Quest;
}) {
  const take = useTakeQuest({ quest: quest! });
  const untake = useUntakeQuest({ quest: quest! });

  if (!quest) return null;

  return (
    <Card className="flex justify-between">
      <CardHeader className="p-2">
        <span className="font-bold">{quest.title}</span>
        <CardDescription>{quest.description}</CardDescription>
      </CardHeader>
      <div className="flex items-center justify-center gap-2 px-2">
        {isTaken ? (
          <>
            <Button size="icon" variant="secondary">
              <UploadIcon />
            </Button>
            <Button
              onClick={async () => untake.mutateAsync(quest.id)}
              size="icon"
              variant="destructive"
            >
              <TrashIcon />
            </Button>
          </>
        ) : (
          <Button onClick={async () => take.mutateAsync(quest.id)} size="icon">
            <CheckIcon />
          </Button>
        )}
      </div>
    </Card>
  );
}
