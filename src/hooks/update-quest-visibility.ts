import { api } from "@/trpc/react";
import { toast } from "sonner";

export function useUpdateQuestVisibility() {
    const utils = api.useUtils();
    return api.quest.toggleQuestVisibility.useMutation({
        onSuccess: async () => {
            toast.success("✅ Quest visibility updated successfully.");
            await utils.quest.getAllNotTakenSideQuests.invalidate();
            await utils.mamet.getQuests.invalidate();
        },
    });
}