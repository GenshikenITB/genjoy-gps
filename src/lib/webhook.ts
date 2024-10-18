import { type Quest } from "@prisma/client";

export function sendMessage(quest: Quest): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fetch("https://discord.com/api/webhooks/1295206078744629299/gpIx_PpDDfvzepVl91IUB_-NIC-MXA2_MqoPgZJ_IMToFzfKyvVQdjsM1TbpY5_C0Ol4", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: "<@&1279817638708772986>",
                embeds: [
                    {
                        id: 652627557,
                        title: "NEW QUEST AVAILABLE",
                        description: "Check them out at [Website GenJourney](https://genjourney.genshiken-itb.org/)!",
                        color: 13598176,
                        fields: [
                            {
                                id: 809688510,
                                name: `${quest.title}`,
                                value: `${quest.description.replaceAll("\n\n", "\n")}`
                            }
                        ],
                        author: {
                            name: "GenJourney",
                            url: "https://genjourney.genshiken-itb.org/"
                        },
                        url: "https://genjourney.genshiken-itb.org/",
                        footer: {
                            text: `${quest.type}`
                        },
                        timestamp: `${new Date().toISOString()}`
                    },
                ]
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    reject(new Error(`Could not send message: ${response.status}`));
                }
                resolve();
            })
            .catch((error) => {
                console.error(error);
                reject(new Error(error instanceof Error ? error.message : String(error)));
            });
    });
}