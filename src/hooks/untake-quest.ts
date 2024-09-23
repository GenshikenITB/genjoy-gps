import { api } from "@/trpc/react";
import type { Quest } from "@prisma/client";

export function useUntakeQuest({ quest }: { quest: Quest }) {
    const utils = api.useUtils();
    return api.quest.untakeQuest.useMutation({
        onMutate: async (id) => {
            await utils.quest.getAllNotTakenSideQuests.cancel();
            await utils.quest.getAllTakenSideQuests.cancel();

            const prevNotTakenQuests = utils.quest.getAllNotTakenSideQuests.getData();
            const prevTakenQuests = utils.quest.getAllTakenSideQuests.getData();

            utils.quest.getAllNotTakenSideQuests.setData(undefined, (old) => {
                return old ? [...old, quest] : [quest];
            });

            utils.quest.getAllTakenSideQuests.setData(undefined, (old) => {
                return old ? old.filter((q) => q.quest.id !== id) : [];
            });

            return { prevNotTakenQuests, prevTakenQuests };
        },
        onError: (err, id, ctx) => {
            if (ctx?.prevNotTakenQuests !== undefined) {
                utils.quest.getAllNotTakenSideQuests.setData(
                    undefined,
                    ctx.prevNotTakenQuests
                );
            }
            if (ctx?.prevTakenQuests !== undefined) {
                utils.quest.getAllTakenSideQuests.setData(
                    undefined,
                    ctx.prevTakenQuests
                );
            }
        },
        onSettled: async () => {
            await utils.quest.getAllNotTakenSideQuests.invalidate();
            await utils.quest.getAllTakenSideQuests.invalidate();
            await utils.quest.getUserScore.invalidate();
        },
    });
}