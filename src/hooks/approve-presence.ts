import { QuestCardProps } from "@/app/(app)/verify/card";
import { api } from "@/trpc/react";
import { QuestEnrollment } from "@prisma/client";

export function useApprovePresence(enrollments: QuestCardProps) {
    const utils = api.useUtils();
    return api.mamet.approvePresence.useMutation({
        onSuccess: async () => {
            await utils.mamet.getAllEnrollments.invalidate();
        },
    });
}