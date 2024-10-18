import { api } from "@/trpc/react";
import { toast } from "sonner";

export function useDeleteQuest() {
    const utils = api.useUtils();
    return api.mamet.deleteQuest.useMutation({
        onMutate() {
            toast.info("⌛ Deleting quest...");
        },
        async onSuccess() {
            await utils.mamet.getQuests.invalidate();
            await utils.quest.getAllNotTakenSideQuests.invalidate();
            toast.success("✅ Quest deleted successfully.");
        },
        onError() {
            toast.error("❗️ An error occurred while deleting the quest.");
        },
    });
}