import { api } from "@/trpc/react";
import { toast } from "sonner";

export function useUnverifyPresence() {
    const utils = api.useUtils();
    return api.mamet.unverifyPresence.useMutation({
        onSuccess: async () => {
            toast.success("✅ Presence unverified successfully.");
            await utils.mamet.getAllEnrollments.invalidate();
        },
    });
}