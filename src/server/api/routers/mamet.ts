import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const mametRouter = createTRPCRouter({
    getAllEnrollments: protectedProcedure
        .query(async ({ ctx }) => {
            // Get all enrollments
            return await ctx.db.questEnrollment.findMany({
                include: {
                    quest: true,
                    user: true,
                }
            });
        }),

    unapprovePresence: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input: id }) => {
            // Unapprove a user's presence
            return await ctx.db.questEnrollment.update({
                where: {
                    id: id,
                },
                data: {
                    isActivelyParticipating: false,
                },
            });
        }),

    approvePresence: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input: id }) => {
            // Approve a user's presence
            return await ctx.db.questEnrollment.update({
                where: {
                    id: id,
                },
                data: {
                    isActivelyParticipating: true,
                },
            });
        }),
})