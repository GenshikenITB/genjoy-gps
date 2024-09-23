import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

export const mametRouter = createTRPCRouter({
    getAllEnrollments: protectedProcedure.query(async ({ ctx }) => {
        // Get all enrollments
        return await ctx.db.questEnrollment.findMany({
            include: {
                quest: true,
                user: true,
            }
        });
    }),
})