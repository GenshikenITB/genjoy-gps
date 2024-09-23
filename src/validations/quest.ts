import { QuestType } from "@prisma/client";
import { z } from "zod";

export const questFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    type: z.nativeEnum(QuestType),
    isHandsOn: z.boolean(),
});

export type QuestFormProps = z.infer<typeof questFormSchema>;