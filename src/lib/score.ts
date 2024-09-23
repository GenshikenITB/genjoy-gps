import { QuestType } from "@prisma/client";

export const calculatePoints = (
    type: string,
    isHandsOn: boolean,
    isActivelyParticipating: boolean,
    isPresent: boolean,
    fixedPtsBidang = 10,
    fixedPtsComun = 5,
): number => {

    // Map quest types to base points
    const basePointsMap: Record<string, number> = {
        [QuestType.CREATIVE_ARTS]: fixedPtsBidang,
        [QuestType.COMMUNITY]: fixedPtsComun
    };

    const baseValue = basePointsMap[type] ?? 0;

    // If the participant did not show up, deduct base points
    if (!isPresent) {
        return -baseValue;
    }

    // If the participant is not active, no points
    if (!isActivelyParticipating) {
        return 0;
    }

    // If the quest is hands-on, add a 50% bonus to base points
    let totalPoints = baseValue;
    if (isHandsOn) {
        totalPoints += baseValue * 0.5;
    }

    return totalPoints;
};
