import { api } from "@/trpc/react";
import type { Quest } from "@prisma/client";

export function useUntakeQuest({ quest }: { quest: Quest }) {
    const utils = api.useUtils();
    return api.quest.untakeQuest.useMutation({
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
                quest,
            ]);
            utils.quest.getAllTakenSideQuests.setData(undefined, (old) =>
                (old ?? []).filter((q) => q.quest.id !== id),
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
}