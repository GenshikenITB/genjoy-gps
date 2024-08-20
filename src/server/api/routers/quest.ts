import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const questRouter = createTRPCRouter({
  getAllNotTakenSideQuests: protectedProcedure.query(async ({ ctx }) => {
    // Get all quests that the user has not completed
    return await ctx.db.quest.findMany({
      where: {
        QuestEnrollment: {
          none: {
            userId: ctx.session.user.id,
            completedAt: { not: null },
          },
        },
      },
    });
  }),

  getAllTakenSideQuests: protectedProcedure.query(async ({ ctx }) => {
    // Get all quests that the user has completed
    return await ctx.db.quest.findMany({
      where: {
        QuestEnrollment: {
          some: {
            userId: ctx.session.user.id,
            completedAt: { not: null },
          },
        },
      },
    });
  }),

  getQuestById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      // Get a specific quest by its id
      const quest = await ctx.db.quest.findUnique({
        where: {
          id,
        },
      });

      if (!quest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quest not found",
        });
      }

      return quest;
    }),

  takeQuest: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      // Mark a quest as completed by the user
      return ctx.db.questEnrollment.upsert({
        where: {
          userId_questId: {
            userId: ctx.session.user.id,
            questId: id,
          },
        },
        update: {
          completedAt: new Date(),
        },
        create: {
          userId: ctx.session.user.id,
          questId: id,
          completedAt: new Date(),
        },
      });
    }),

  untakeQuest: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      // Mark a quest as not completed by the user
      return ctx.db.questEnrollment.delete({
        where: {
          userId_questId: {
            userId: ctx.session.user.id,
            questId: id,
          },
        },
      });
    }),

});