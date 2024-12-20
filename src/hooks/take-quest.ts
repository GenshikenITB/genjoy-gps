import { api } from "@/trpc/react";
import type { Quest } from "@prisma/client";
import { toast } from "sonner";

export function useTakeQuest({ quest }: { quest: Quest }) {
    const utils = api.useUtils();
    return api.quest.takeQuest.useMutation({
        onMutate: async (id) => {
            toast.info("⌛ Taking quest...");
            await utils.quest.getAllNotTakenSideQuests.cancel();
            await utils.quest.getAllTakenSideQuests.cancel();

            const prevNotTakenQuests = utils.quest.getAllNotTakenSideQuests.getData();
            const prevTakenQuests = utils.quest.getAllTakenSideQuests.getData();

            utils.quest.getAllNotTakenSideQuests.setData(undefined, (old) =>
                old ? old.filter((q) => q.id !== id.id) : []
            );
            utils.quest.getAllTakenSideQuests.setData(undefined, (old) => {
                const newQuest = {
                    quest: { ...quest },
                    id: id.id,
                    userId: '',
                    questId: '',
                    isActivelyParticipating: null,
                    isPresent: null,
                    isPresentVerified: false,
                    completedAt: null
                };
                return old ? [...old, newQuest] : [newQuest];
            });

            return { prevNotTakenQuests, prevTakenQuests };
        },
        onError: (err, id, ctx) => {
            toast.error("❗️ An error occurred while taking the quest.");
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
        onSuccess: async () => {
            toast.success("✅ Quest taken successfully.");
            await utils.quest.getAllNotTakenSideQuests.invalidate();
            await utils.quest.getAllTakenSideQuests.invalidate();
            await utils.quest.getUserScore.invalidate();
            await utils.mamet.getAllEnrollments.invalidate();
        },
    });
}