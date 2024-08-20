import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { api } from "@/trpc/react";
import type { Quest } from "@prisma/client";
import { CheckIcon, TrashIcon, UploadIcon } from "lucide-react";

export function SideQuestCard({
  isTaken = false,
  quest,
}: {
  isTaken?: boolean;
  quest?: Quest;
}) {
  const utils = api.useUtils();

  const untake = api.quest.untakeQuest.useMutation({
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await utils.quest.getAllNotTakenSideQuests.cancel();
      await utils.quest.getAllTakenSideQuests.cancel();

      // Get the data from the cache
      const prevNotTakenQuests = utils.quest.getAllNotTakenSideQuests.getData();
      const prevTakenQuests = utils.quest.getAllTakenSideQuests.getData();

      // Optimistically update the cache
      utils.quest.getAllNotTakenSideQuests.setData(undefined, (old) => [
        ...(old ?? []),
        quest!,
      ]);
      utils.quest.getAllTakenSideQuests.setData(undefined, (old) =>
        (old ?? []).filter((q) => q.id !== id),
      );

      // Return the previous state
      return { prevNotTakenQuests, prevTakenQuests };
    },
    onError: (err, id, ctx) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      utils.quest.getAllNotTakenSideQuests.setData(
        undefined,
        ctx?.prevNotTakenQuests,
      );
      utils.quest.getAllTakenSideQuests.setData(
        undefined,
        ctx?.prevTakenQuests,
      );
    },
    onSettled: async () => {
      // Invalidate the queries to ensure subsequent uses will be fresh
      await utils.quest.getAllNotTakenSideQuests.invalidate();
      await utils.quest.getAllTakenSideQuests.invalidate();
    },
  });

  const take = api.quest.takeQuest.useMutation({
    onMutate: async (id) => {
      await utils.quest.getAllNotTakenSideQuests.cancel();
      await utils.quest.getAllTakenSideQuests.cancel();

      const prevNotTakenQuests = utils.quest.getAllNotTakenSideQuests.getData();
      const prevTakenQuests = utils.quest.getAllTakenSideQuests.getData();

      utils.quest.getAllNotTakenSideQuests.setData(undefined, (old) =>
        (old ?? []).filter((q) => q.id !== id),
      );
      utils.quest.getAllTakenSideQuests.setData(undefined, (old) => [
        ...(old ?? []),
        quest!,
      ]);

      return { prevNotTakenQuests, prevTakenQuests };
    },
    onError: (err, id, ctx) => {
      utils.quest.getAllNotTakenSideQuests.setData(
        undefined,
        ctx?.prevNotTakenQuests,
      );
      utils.quest.getAllTakenSideQuests.setData(
        undefined,
        ctx?.prevTakenQuests,
      );
    },
    onSuccess: async () => {
      await utils.quest.getAllNotTakenSideQuests.invalidate();
      await utils.quest.getAllTakenSideQuests.invalidate();
    },
  });

  const handleTake = async (id: string) => {
    await take.mutateAsync(id);
  };

  const handleUntake = async (id: string) => {
    await untake.mutateAsync(id);
  };

  // Ensure quest is defined before rendering
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
              onClick={() => handleUntake(quest.id)}
              size="icon"
              variant="destructive"
            >
              <TrashIcon />
            </Button>
          </>
        ) : (
          <Button onClick={() => handleTake(quest.id)} size="icon">
            <CheckIcon />
          </Button>
        )}
      </div>
    </Card>
  );
}
