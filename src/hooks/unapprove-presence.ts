import { api } from "@/trpc/react";
import { QuestEnrollment } from "@prisma/client";

export function useUnapprovePresence(enrollments: QuestEnrollment) {
    const utils = api.useUtils();
    return api.mamet.unapprovePresence.useMutation({
        onSuccess: async () => {
            await utils.mamet.getAllEnrollments.invalidate();
        },
    });
}