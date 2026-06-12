import { SYSTEM_ID } from "../config/uiConstants.js"
export default class helperTools {

    /**
     * getActor
     * @param {*} actorId 
     * @param {*} tokenId 
     * @param {*} actorUuid 
     * @returns 
     */
    static getActor(actorId, tokenId) {
        if (tokenId && tokenId !== '' && tokenId !== 'undefined') {
            const scene = game.scenes.active
            if (!scene) return null
            return scene.tokens.get(tokenId).actor            
        } else {
            if (!actorId || actorId === '') return
            return game.actors.get(actorId)
        }
        return null
    }

    /**
     * numberArray
     * @param {*} max 
     */
    static numberArray(max) {
        return Array(max).fill().map((x,i)=>i)        
    }
}