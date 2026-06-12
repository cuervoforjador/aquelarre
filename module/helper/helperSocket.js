import { SYSTEM_ID } from "../config/uiConstants.js"
import helperCombat from "./helperCombat.js"

export default class helperSocket {

    /**
     * onSocketMessage
     * @param {*} data 
     * @returns 
     */
    static async onSocketMessage(data) {

        const activeGM = game.users.activeGM
        if (!game.user.isGM || (activeGM && activeGM.id !== game.user.id)) return
        switch (data.type) {
            case "applyDamage": {
                await helperCombat.applyDamage(data)
                break
            }
        }
    }

    /**
     * requestDamage
     * @param {*} options 
     */
    static async requestDamage({ actorId, tokenId, stats, chatMessageId = null }) {
        if (game.user.isGM) return helperCombat.applyDamage({ actorId, tokenId, stats, chatMessageId })
        if (!game.socket) return
        game.socket.emit(`system.${SYSTEM_ID}`, {
            type: "applyDamage",
            actorId,
            tokenId,
            stats,
            chatMessageId,
        }) 
        ui.notifications.info(game.i18n.localize("info.peticionDano"))       
    }
}