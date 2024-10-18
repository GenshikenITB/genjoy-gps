import { QuestType } from "@prisma/client";

export const calculatePoints = (
    type: string,
    isHandsOn: boolean,
    isActivelyParticipating: boolean | null,
    isPresentVerified: boolean,
    isPresent: string | null,
): number => {

    // Map quest types to base points
    const basePointsMap: Record<string, number> = {
        [QuestType.CREATIVE_ARTS]: 10,
        [QuestType.COMMUNITY]: 5,
        [QuestType.MAGANG]: 30,
    };

    const baseValue = basePointsMap[type] ?? 0;

    // If the participant submitted proof, make it 0 points
    // because the participant haven't been verified
    if (isPresent && isActivelyParticipating === null) {
        return 0;
    }

    // If the participant is verified as not present, deduct base points
    if (!isActivelyParticipating) {
        return -baseValue;
    }

    // If the participant is not active, no points
    if (!isPresentVerified) {
        return 0;
    }

    // If the quest is hands-on, add a 50% bonus to base points
    let totalPoints = baseValue;
    if (isHandsOn) {
        totalPoints += baseValue * 0.5;
    }


    return totalPoints;
};
