import { api } from "@/trpc/react";

export function useUnverifyPresence() {
    const utils = api.useUtils();
    return api.mamet.unverifyPresence.useMutation({
        onSuccess: async () => {
            await utils.mamet.getAllEnrollments.invalidate();
        },
    });
}