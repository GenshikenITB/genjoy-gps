import { api } from "@/trpc/react";

export function useUntakeQuest() {
    const utils = api.useUtils();
    return api.quest.untakeQuest.useMutation({
        onSuccess: async () => {
            await utils.quest.getAllNotTakenSideQuests.invalidate();
            await utils.quest.getAllTakenSideQuests.invalidate();
            await utils.quest.getUserScore.invalidate();
            await utils.mamet.getAllEnrollments.invalidate();
        },
    });
}