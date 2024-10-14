import { api } from "@/trpc/react";
import { toast } from "sonner";

export function useApproveParticipation() {
    const utils = api.useUtils();
    return api.mamet.approveActiveParticipate.useMutation({
        onSuccess: async () => {
            toast.success("✅ Participation approved successfully.");
            await utils.mamet.getAllEnrollments.invalidate();
        },
    });
}