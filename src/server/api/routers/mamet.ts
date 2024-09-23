import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { questFormSchema } from "@/validations/quest";
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

    unapproveActiveParticipate: protectedProcedure
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

    approveActiveParticipate: protectedProcedure
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

    verifyPresence: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input: id }) => {
            // Verify a user's presence
            return await ctx.db.questEnrollment.update({
                where: {
                    id: id,
                },
                data: {
                    isPresentVerified: true,
                },
            });
        }),

    unverifyPresence: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input: id }) => {
            // Unverify a user's presence
            return await ctx.db.questEnrollment.update({
                where: {
                    id: id,
                },
                data: {
                    isPresentVerified: false,
                },
            });
        }),

    createQuest: protectedProcedure
        .input(questFormSchema)
        .mutation(async ({ ctx, input }) => {
            // Create a new quest
            return await ctx.db.quest.create({
                data: input,
            });
        }),

    editQuest: protectedProcedure
        .input(z.object({
            id: z.string(),
            data: questFormSchema,
        }))
        .mutation(async ({ ctx, input }) => {
            // Edit a quest
            return await ctx.db.quest.update({
                where: {
                    id: input.id,
                },
                data: input.data,
            });
        }),

    deleteQuest: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input: id }) => {
            // Delete a quest
            return await ctx.db.quest.delete({
                where: {
                    id: id,
                },
            });
        }),

    getQuests: protectedProcedure
        .query(async ({ ctx }) => {
            // Get all quests
            return await ctx.db.quest.findMany();
        }),
})