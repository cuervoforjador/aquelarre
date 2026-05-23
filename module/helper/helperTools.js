export default class helperTools {

    /**
     * getActor
     * @param {*} actorId 
     * @param {*} tokenId 
     * @returns 
     */
    static getActor(actorId, tokenId) {

        if (!tokenId && tokenId !== '') {
            const scene = game.scenes.active
            if (!scene) return null
            return scene.tokens.get(tokenId).actor            
        } else {
            if (!actorId || actorId === '') return
            return game.actors.get(actorId)
        }
        return null
    }
}