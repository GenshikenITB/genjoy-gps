import { api } from "@/trpc/react";
import { toast } from "sonner";

export function useUploadProofQuest({ setIsDialogOpen }: { setIsDialogOpen: (open: boolean) => void }) {
    const utils = api.useUtils();
    return api.quest.uploadProof.useMutation({
        onSuccess: async () => {
            setIsDialogOpen(false);
            toast.success("🎉 Proof uploaded successfully.");
            await utils.quest.getAllTakenSideQuests.invalidate();
            await utils.quest.getUserScore.invalidate();
        },
    });
}