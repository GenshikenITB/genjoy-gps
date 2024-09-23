import { api } from "@/trpc/react";

export function useApproveParticipation() {
    const utils = api.useUtils();
    return api.mamet.approveActiveParticipate.useMutation({
        onSuccess: async () => {
            await utils.mamet.getAllEnrollments.invalidate();
        },
    });
}