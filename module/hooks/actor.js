import { SYSTEM_ID, ACTOR_IMG } from "../config/uiConstants.js"

export default class hooksActor {

    /**
     * createActor
     * @param {*} newActor 
     * @param {*} options 
     * @param {*} id 
     */
    static async createActor(newActor, options, id) {        
        newActor.update({'img': `systems/${SYSTEM_ID}/${ACTOR_IMG}`})
    }
}