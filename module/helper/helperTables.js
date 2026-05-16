import { SYSTEM_ID } from "../config/uiConstants.js"
import newRollTable from "../documents/rollTable.js";
import helperContext from "./helperContext.js"

export default class helperTables {

    /**
     * tableLore
     * @param {*} rules 
     * @param {*} lore 
     * @param {*} actor 
     * @param {*} auto
     */
    static async tableLore(rules, lore, actor, auto=false) {
        const mOptions = await helperContext.getLoreOptions(rules, lore, actor)

        if (mOptions.length === 1) {
            await helperContext.assignLoreToActor(rules, lore, actor, mOptions[0].item.system.key)
            return
        }

        const mResults = [];
        mOptions.map(option => {
            mResults.push({
                name: option.item.name+'   ['+this._getResultRange(rules, lore, option)[0]+' - '+
                                         this._getResultRange(rules, lore, option)[1]+']',
                img: option.item.img,
                description: option.item.system.descripcion,
                range: this._getResultRange(rules, lore, option),
                flags: { 'key': {'value': option.item.system.key}},
                type: 'text'
            })
        })
        const table = await newRollTable.create({
            name: actor.name+' - '+game.i18n.localize('common.'+lore),
            img: actor.img,
            description: game.i18n.localize('explain.rollTable_'+lore),
            displayRoll: true,
            ownership: actor.ownership,
            formula: this._getResultFormula(rules, lore, mOptions),
            results: mResults,
            flags: {
                isLore: {value: true},
                rules: {value: rules},
                lore: {value: lore},
                actorId: {value: actor.id},
                tokenId: {value: actor.isToken ? actor.token.id : ''}
            }
        })

        if (mOptions.length === 1) {
            await table.draw()
        } else {
            const sheet = table.sheet
            await sheet.render(true)
        }

        //const roll = await table.draw()
        //if (game.dice3d) await game.dice3d.showForRoll(roll.roll)
        //await table.delete()
    }

    static _getResultRange(rules, lore, option) {
        return [!option.low ? 0 : option.low, 
                !option.high ? 0 : option.high]
    }

    static _getResultFormula(rules, lore, mOptions) {
        let nMax = 0
        mOptions.map(option => {
            if (this._getResultRange(rules, lore, option)[1] > nMax)
                nMax = this._getResultRange(rules, lore, option)[1]
        })
        if (nMax > 0) return '1D'+nMax
                 else return '0'
    }

}