import { api } from "@/trpc/react";
import { toast } from "sonner";

export function useUntakeQuest() {
    const utils = api.useUtils();
    return api.quest.untakeQuest.useMutation({
        onSuccess: async () => {
            toast.success("✅ Quest untaken successfully.");
            await utils.quest.getAllNotTakenSideQuests.invalidate();
            await utils.quest.getAllTakenSideQuests.invalidate();
            await utils.quest.getUserScore.invalidate();
            await utils.mamet.getAllEnrollments.invalidate();
        },
    });
}