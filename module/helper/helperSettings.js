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

        /*
        game.settings.register(SYSTEM_ID, "rollMoonDieByDefault", {
            name: "CELESTOPOL.Setting.rollMoonDieByDefault.name",
            hint: "CELESTOPOL.Setting.rollMoonDieByDefault.hint",
            scope: "world",
            config: true,
            type: Boolean,
            default: false,
        })
        game.settings.register(SYSTEM_ID, FACTION_ASPECT_STATE_SETTING, {
            scope: "world",
            config: false,
            type: Object,
            default: _getDefaultFactionAspectState(),
        })            
        */

    }

    /*
    function _getDefaultFactionAspectState() {
        return {
            pointsMax: 8,
            activatedAspects: [],
            customCell: {
            enabled: false,
            mode: "replace",
            name: "",
            aspectIds: [],
            },
        }
    }    
    */
}