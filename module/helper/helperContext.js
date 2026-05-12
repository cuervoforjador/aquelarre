import { SYSTEM_ID } from "../config/uiConstants.js"
import extendCharacter_Character from "../models/character/character.js"

export default class helperContext {

    /**
     * getRules
     */
    static getRules() {
        const rules = game.settings.settings.get('aquelarre.rules').choices
        let oReturn = {}
        for (var s in rules) {
            oReturn[s] = {
                key: s,
                label: game.i18n.localize(rules[s])
            }
        }
        return oReturn
    }

    /**
     * getWorldRules
     */
    static getWorldRules() {
        return game.settings.get(SYSTEM_ID, "rules");
    }

    /**
     * getCaracteristicas
     */
    static getCaracteristicas() {

        let mReturn = {};
        const schema = extendCharacter_Character.defineSchema();
        for (var s in schema.caracteristicas.fields) {
            const label = game.i18n.localize(schema.caracteristicas.fields[s].label) +
                          ' (' + game.i18n.localize(schema.caracteristicas.fields[s].hint) + ')'
            //mReturn.push({ key: s, label: label });
            mReturn[s] = { key: s, label: label };
        }
        return mReturn
    }

    /**
     * getSociedades
     */
    static async getSociedades(rules) {
        const mDocs = await this.getFromCompendium(rules, 'sociedad')
        return this._toObject(mDocs)     
    }

    /**
     * getIdiomas
     */
    static async getIdiomas(rules) {
        const mDocs = await this.getFromCompendium(rules, 'competencia')
        const mLangs = mDocs.filter(e => e.system.idioma)
        return this._toObject(mLangs)    
    }

    /**
     * getPueblos
     */
    static async getPueblos(rules) {
        const mDocs = await this.getFromCompendium(rules, 'pueblo')
        return this._toObject(mDocs)   
    }

    /**
     * getPosiciones
     */
    static async getPosiciones(rules) {
        const mDocs = await this.getFromCompendium(rules, 'posicion')
        return this._toObject(mDocs)   
    }

    /**
     * getLoreReinos
     * @param {*} rules 
     */
    static async getLoreReinos(rules) {
        const mDocs = await this.getFromCompendium(rules, 'reino')
        return {...{null: {key:'', label:''}}, ...this._toObject(mDocs)}
    }

    /**
     * getFromCompendium
     */
    static async getFromCompendium(rules, sType=null) {
        let mReturn = [];
        let mPacks = game.packs.filter(e => e.metadata.flags.rules === rules)
        for (var pack of mPacks) {
            const mDocs = (!sType || sType === '') ? await pack.getDocuments() :
                                                    (await pack.getDocuments()).filter(e => e.type === sType)
            mDocs.map(o => { mReturn.push(o) })
        }
        mReturn.sort((a,b) => a.name.localeCompare(b.name))
        return mReturn
    }

    /**
     * _toObject
     */
    static _toObject(mDocs) {
        let oReturn = {}
        mDocs.map(o => { oReturn[o.system.key] = {key: o.system.key, label: o.name} })   
        return oReturn           
    }

}