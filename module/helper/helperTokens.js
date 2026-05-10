export default class helperTokens {

    /**
     * configTrackableAttributes
     */
    static configTrackableAttributes() {

        CONFIG.Actor.trackableAttributes = {
            character: {
                bar:   ["attributes.health.points"],
                value: ["primary.strength", "primary.constitution"],
            },
            npc: {
                bar:   ["attributes.health.points"],
                value: ["primary.strength"],
            }
        }

    }
}