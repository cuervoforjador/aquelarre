import { SYSTEM_ID, ACTOR_IMG, ACTOR_IMGvyc } from "../config/uiConstants.js"

export default class hooksActor {

    /**
     * createActor
     * @param {*} newActor 
     * @param {*} options 
     * @param {*} id 
     */
    static async createActor(newActor, options, id) {        
        const rules = game.settings.get(SYSTEM_ID, 'rules')
        const imgSrc = (rules !== 'vyc') ? ACTOR_IMG : ACTOR_IMGvyc
        await newActor.update({
                                'img': `systems/${SYSTEM_ID}/${imgSrc}`,
                                'system.rules': rules
                              })
    }
}