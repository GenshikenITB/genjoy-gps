import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

import { z } from "zod";

export const mametRouter = createTRPCRouter({
    getAllEnrollments: protectedProcedure.query(async ({ ctx }) => {
        // Get all enrollments
        return await ctx.db.questEnrollment.findMany();
    }),
})