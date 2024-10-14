import { api } from "@/trpc/react";
import { toast } from "sonner";

export function useUnapproveParticipation() {
    const utils = api.useUtils();
    return api.mamet.unapproveActiveParticipate.useMutation({
        onSuccess: async () => {
            toast.success("✅ Participation unapproved successfully.");
            await utils.mamet.getAllEnrollments.invalidate();
        },
    });
}