import { api } from "@/trpc/react";

export function useUploadProofQuest({ setIsDialogOpen }: { setIsDialogOpen: (open: boolean) => void }) {
    const utils = api.useUtils();
    return api.quest.uploadProof.useMutation({
        onSuccess: async () => {
            setIsDialogOpen(false);
            await utils.quest.getAllTakenSideQuests.invalidate();
        },
    });
}