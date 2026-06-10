import { SYSTEM_ID } from "../config/uiConstants.js"
import { configRULES } from "../config/rules.js"
import extendCharacter_Character from "../models/character/character.js"
import { aqConfig } from "../config/config.js"

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

        let oReturn = {};
        const schema = extendCharacter_Character.defineSchema();
        for (var s in schema.caracteristicas.fields) {
            const label = game.i18n.localize(schema.caracteristicas.fields[s].label) +
                          ' (' + game.i18n.localize(schema.caracteristicas.fields[s].hint) + ')'
            oReturn[s] = { key: s, label: label };
        }
        return oReturn
    }

    /**
     * getCompetencias
     * @param {*} rules 
     */
    static async getCompetencias(rules) {
        const mSkills = await this.getFromCompendium(rules, 'competencia')
        mSkills.sort((a,b) => a.name.localeCompare(b.name))
        return mSkills           
    }
    static async getCompetenciasObject(rules) {
        let oReturn = {};
        (await this.getCompetencias(rules)).map(e => {
            oReturn[e.system.key] = {
                key: e.system.key,
                label: e.name + ' (' + game.i18n.localize('CHAR.'+e.system.caracteristica) + ')'
            }
        })
        return oReturn
    }    

    /**
     * getCompetenciasArmas
     * @param {*} rules 
     */
    static async getCompetenciasArmas(rules) {
        return (await this.getCompetencias(rules)).filter(e => e.system.armas)
    }
    static async getCompetenciasArmasSheet(rules) {
        let oReturn = {}
        const mSkills = await this.getCompetenciasArmas(rules)
        mSkills.map(o => {
            oReturn[o.system.key] = {
                key: o.system.key,
                label: o.name
            }
        })
        return oReturn
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
     * getEstratos
     */
    static async getEstratos(rules) {
        const mDocs = await this.getFromCompendium(rules, 'estrato')
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
     * getFromCompendium
     * @param {*} rules 
     * @param {*} sType 
     * @returns 
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
     * getLoreItem
     * @param {*} rules 
     * @param {*} lore 
     * @param {*} key 
     */
    static async getLoreItem(rules, lore, key) {
        const mDocs = await this.getFromCompendium(rules, lore)
        return mDocs.find(e => e.system.key === key)
    }

    /**
     * getLoreOptions
     * @param {*} rules 
     * @param {*} lore 
     * @param {*} actor
     */
    static async getLoreOptions(rules, lore, actor) {
        const mDocs = await this.getFromCompendium(rules, lore)
        let mReturn = []
        switch (lore) {

            case 'reino':
                mDocs.map(o => { mReturn.push({ low: o.system.roll.low, high: o.system.roll.high, item: o }) })
                break;

            case 'pueblo':
                const reino = actor.items.find(e => e.type === 'reino')
                mReturn = this._getLoreTable(reino, "system.pueblos", mDocs)
                break;

            case 'estrato':
                if (configRULES[rules].estratoRoll) {
                    const pueblo = actor.items.find(e => e.type === 'pueblo')
                    mReturn = this._getLoreTable(pueblo, "system.estratos", mDocs)
                } 
                break;

            case 'posicion':
                if (configRULES[rules].posicionRoll) {
                    const sociedad = actor.items.find(e => e.type === 'sociedad')
                    const mEstratos = await this.getFromCompendium(rules, 'estrato')
                    const mEstratosFiltered = mEstratos.filter(e => e.system.sociedad.key === sociedad.system.key)
                    mEstratosFiltered.map(estrato => {
                        estrato.system.posiciones.map(posicion => {
                            const doc = mDocs.find(e => e.system.key === posicion.key)
                            if (!doc) return
                            mReturn.push({ low: doc.system.roll.low, high: doc.system.roll.high, item: doc })
                        })
                    })
                } else {
                    const estrato = actor.items.find(e => e.type === 'estrato')
                    mReturn = this._getLoreTable(estrato, "system.posiciones", mDocs)
                }
                break;
        }
        mReturn.sort((a,b) => a.low - b.low)            
        return mReturn        
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
     * getArmasTamanos
     * @param {*} rules 
     */
    static getArmasTamanos(rules) {
        let mReturn = []
        for (var s in aqConfig.armas.tamanos) {
            mReturn.push({
                key: s,
                label: game.i18n.localize(aqConfig.armas.tamanos[s].label)
            })
        }
        return mReturn
    }
    static getArmasTamanosSheet(rules) {
        let oReturn = {}
        this.getArmasTamanos(rules).map(o => {
            oReturn[o.key] = o
        })
        return oReturn
    }

    /**
     * getArmadurasTipos
     * @param {*} rules 
     */
    static getArmadurasTipos(rules) {
        let mReturn = []
        for (var s in aqConfig.armaduras.tipos) {
            mReturn.push({
                key: s,
                label: game.i18n.localize(aqConfig.armaduras.tipos[s].label)
            })
        }
        return mReturn
    }
    static getArmadurasTiposSheet(rules) {
        let oReturn = {}
        this.getArmadurasTipos(rules).map(o => {
            oReturn[o.key] = o
        })
        return oReturn
    }

    /**
     * getLocalizacionesTipos
     * @param {*} rules 
     */
    static getLocalizacionesTipos(rules) {
        let oReturn = {}
        for (var s in aqConfig.localizaciones) {
            oReturn[s] = {
                key: s,
                label: game.i18n.localize('common.'+s)
            }
        }
        return oReturn
    }

    /**
     * getLocalizaciones
     * @param {*} rules 
     * @param {*} option (Actor / location Type)
     */
    static getLocalizaciones(rules, option) {
        if (option === '') option = 'humanoide'
        const location = typeof option === 'string' ? option : option.system.info.localizacion
        return aqConfig.localizaciones[location]
    }
    static getMLocalizaciones(rules, option) {
        const locations = this.getLocalizaciones(rules, option)
        let mReturn = []
        for (var s in locations.partes) { mReturn.push({...locations.partes[s], ...{key: s}}) }
        return mReturn
    }
    static getLocalizacionesPartes(rules, option) {
        let oReturn = {}
        const locations = this.getLocalizaciones(rules, option)  
        for (var s in locations.partes) {
            oReturn[s] = {
                key: s,
                label: game.i18n.localize('common.'+s)
            }
        }
        return oReturn              
    }

    /**
     * assignLoreToActor
     * @param {*} rules 
     * @param {*} lore 
     * @param {*} actor 
     * @param {*} key 
     */
    static async assignLoreToActor(rules, lore, actor, key) {
        const item = await this.getLoreItem(rules, lore, key)
        if (!item) return

        for (var sLore of this._loreToClean(lore)) {
            for (var oItem of actor.items.filter(e => e.type === sLore )) {
                await oItem.delete()
            }
        }
        await Item.create(item, {parent: actor})
        
        //Añadiendo Sociedad y Limpieza de Sangre en el caso de ser un Origen
        if (item.type === 'pueblo') {
            const newItem = await this.getLoreItem(rules, 'sociedad', item.system.sociedad.key)
            if (!newItem) return
            await Item.create(newItem, {parent: actor})
            actor.update({"system.info.limpiezaSangre": item.system.sangre})
        }
    }

    /**
     * deleteAllContext
     * @param {*} actor 
     */
    static async deleteAllContext(actor) {
        let mItems = [];
        ['competencia', 'posicion', 'estrato', 'sociedad', 'pueblo', 'reino'].map(sType => {
            actor.items.filter(e => e.type === sType).map(o => mItems.push(o.id))
        })
        await Item.deleteDocuments(mItems, {parent: actor})
    }

    /**
     * _loreToClean 
     */    
    static _loreToClean(lore) {
        let mReturn = []
        switch (lore) {            
            case 'reino': mReturn.push('reino')
            case 'pueblo': mReturn.push('pueblo')
            case 'sociedad': mReturn.push('sociedad')
            case 'estrato': mReturn.push('estrato')
            case 'posicion': mReturn.push('posicion')
        }
        return mReturn
    }

    /**
     * _getLoreTable
     */
    static _getLoreTable(item, path, mDocs) {
        let mReturn = []
        if (!item) return []
        const content = this._access(item, path)

        content.map(row => {
            const entry = mDocs.find(o => o.system.key === row.key)
            mReturn.push({  low: row.low,
                            high: row.high,
                            item: entry })
        })         
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

    /**
     * _access
     */
    static _access(object, path) {
        let oReturn = object
        path.split('.').map(s => { oReturn = oReturn[s] })
        return oReturn
    }    

}