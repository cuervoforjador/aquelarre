import { SYSTEM_ID } from "../config/uiConstants.js"
import newRoll from "../documents/roll.js";
import helperContext from "./helperContext.js"

export default class helperRolls {

    /**
     * roll
     * @param {*} actor 
     * @param {*} target 
     * @param {*} path 
     * @param {*} useLuck 
     */
    static async roll(actor, target, path, useLuck=true) {
        
        let percent = 0

        switch(target) {
            case 'char':
                percent = Number(actor.system.caracteristicas[path].value)*5
                await this.simpleRoll({
                            actor: actor,
                            formula: '1D100', 
                            percent: percent, 
                            useluck: useLuck,
                            title: game.i18n.localize('common.rollChar'),
                            subtitle: game.i18n.localize('CHAR.'+path) + ' x5' })

                break;

            case 'attr':                
                percent = Number(this._access(actor.system.atributos, path))
                await this.simpleRoll({
                            actor: actor,
                            formula: '1D100', 
                            percent: percent, 
                            useluck: useLuck,
                            title: game.i18n.localize('common.rollAttr'),
                            subtitle: game.i18n.localize('ATTR.'+path.split('.')[0]) })

                break;

            case 'skill':  
                const skill = actor.items.find(e => e.type === 'competencia' && e.system.key === path)
                const stats = actor.system.competencias.find(e => e.key === path)
                if (!skill || !stats) return

                await this.simpleRoll({
                            actor: actor,
                            formula: '1D100', 
                            percent: stats.stats.value, 
                            useluck: useLuck,
                            title: skill.name,
                            subtitle: game.i18n.localize('common.base')+': '+stats.stats.value+'%',
                            img: skill.img })

                break;                
        }

    }

    /**
     * simpleRoll
     * @param {*} formula 
     * @param {*} percent 
     * @param {*} title 
     */
    static async simpleRoll({actor=null, formula='', percent=0, useluck=true, title='', subtitle='', img=''}) {

        const diceRoll = new newRoll('1D100', { 
            actor: actor,
            rollType: 'simple',
            useDiffLevel: true,
            percent: percent,
            useluck: useluck,
            title: title,
            subtitle: subtitle,
            img: img
        });
        await diceRoll.rollit()

    }

    /**
     * _access
     * @param {*} object 
     * @param {*} path 
     * @returns 
     */
    static _access(object, path) {
        let oReturn = object
        path.split('.').map(s => { oReturn = oReturn[s] })
        return oReturn
    }    

}