import { api } from "@/trpc/react";
import { toast } from "sonner";

export function useVerifyPresence() {
    const utils = api.useUtils();
    return api.mamet.verifyPresence.useMutation({
        onSuccess: async () => {
            toast.success("✅ Presence verified successfully.");
            await utils.mamet.getAllEnrollments.invalidate();
        },
    });
}