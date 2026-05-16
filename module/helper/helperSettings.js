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
    }

}