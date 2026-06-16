import { SYSTEM_ID } from "../config/uiConstants.js"

export default class helperSettings {

    /**
     * register
     */
    static register() {

        game.settings.register(SYSTEM_ID, "rules", {
            name: "common.rules",
            hint: "tooltip.rules",
            scope: "world",
            config: true,
            type: String,
            default: 'aq3',
            requiresReload: true,
            choices: {
                "aq3": game.i18n.localize('RULES.aq3'),
                "aq4": game.i18n.localize('RULES.aq4'),
                "vyc": game.i18n.localize('RULES.vyc'),
            },            
        })

        game.settings.register(SYSTEM_ID, "firstTime", {
            name: "common.firstTime",
            hint: "tooltip.firstTime",
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
            requiresReload: true 
        })        
    }

    /**
     * getFirstTime
     * @returns 
     */
    static getFirstTime() {
        return game.settings.get(SYSTEM_ID,'firstTime');
    }

}