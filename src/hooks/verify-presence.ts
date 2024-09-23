import { api } from "@/trpc/react";

export function useVerifyPresence() {
    const utils = api.useUtils();
    return api.mamet.verifyPresence.useMutation({
        onSuccess: async () => {
            await utils.mamet.getAllEnrollments.invalidate();
        },
    });
}