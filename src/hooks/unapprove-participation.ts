import { api } from "@/trpc/react";

export function useUnapproveParticipation() {
    const utils = api.useUtils();
    return api.mamet.unapproveActiveParticipate.useMutation({
        onSuccess: async () => {
            await utils.mamet.getAllEnrollments.invalidate();
        },
    });
}