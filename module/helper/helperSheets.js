import { SYSTEM_ID } from "../config/uiConstants.js"

import extendCharacterSheet from "../sheets/character/character.js"
import extendCharacterNPCSheet from "../sheets/character/npc.js"

import sheetItem from "../sheets/item/item.js"
import sheetCompetencia  from "../sheets/item/competencia.js"
import sheetSociedad  from "../sheets/item/sociedad.js"
import sheetPueblo  from "../sheets/item/pueblo.js"
import sheetReino  from "../sheets/item/reino.js"
import sheetEstrato  from "../sheets/item/estrato.js"
import sheetPosicion  from "../sheets/item/posicion.js"
import sheetProfesion  from "../sheets/item/profesion.js"

export default class helperSheets {

    /**
     * initSheets
     */
    static initSheets() {       
        
        const v2 = foundry.applications.sheets.ActorSheetV2        
        const actorTypes = [
            "character",
            "npc"
        ]

        v2.unregisterSheet?.("core", "Actor", { types: actorTypes })

        const vA = foundry.documents.collections.Actors
        foundry.appv1?.sheets?.ActorSheet && vA.unregisterSheet("core", foundry.appv1.sheets.ActorSheet)

        vA.registerSheet(SYSTEM_ID, extendCharacterSheet, {
            types: ["character"],
            makeDefault: true,
            label: "sheet.character",
        })  
        
        const vI = foundry.documents.collections.Items
        foundry.appv1?.sheets?.ItemSheet && vI.unregisterSheet("core", foundry.appv1.sheets.ItemSheet)

        vI.registerSheet(SYSTEM_ID, sheetItem, { types: ["item"], makeDefault: true, label: "sheet.item" })
        vI.registerSheet(SYSTEM_ID, sheetCompetencia, { types: ["competencia"], makeDefault: true, label: "sheet.competencia" })
        vI.registerSheet(SYSTEM_ID, sheetSociedad, { types: ["sociedad"], makeDefault: true, label: "sheet.sociedad" })
        vI.registerSheet(SYSTEM_ID, sheetPueblo, { types: ["pueblo"], makeDefault: true, label: "sheet.pueblo" })
        vI.registerSheet(SYSTEM_ID, sheetReino, { types: ["reino"], makeDefault: true, label: "sheet.reino" })
        vI.registerSheet(SYSTEM_ID, sheetEstrato, { types: ["estrato"], makeDefault: true, label: "sheet.estrato" })
        vI.registerSheet(SYSTEM_ID, sheetPosicion, { types: ["posicion"], makeDefault: true, label: "sheet.posicion" })
        vI.registerSheet(SYSTEM_ID, sheetProfesion, { types: ["profesion"], makeDefault: true, label: "sheet.profesion" })

    }

    /**
     * checkStats
     * @param {*} system 
     */
    static checkStats(system) {

        [system.caracteristicas, system.atributos].map(group => {
            if (!!group) {
                for (var s in group) {
                    const char = group[s];
                    ['value', 'total'].map(field => {
                        char[field] = char[field] < char.min ? char.min :
                                      char[field] > char.max ? char.max : char[field];
                    })             
                }
            }
        })
        return system
    }

    /**
     * drawSpectrum
     * @param {*} html 
     */
    static drawSpectrum(html) {
        html.find('[data-spectrum="true"]').each( (i,e) => {
            const value = Number($(e).find('span._value').html())
            let hex = Math.round((value / 100)*255).toString(16);
                hex = hex.length === 1 ? '0' + hex : hex;
            const sColor = '#FF' + hex + hex;
            $(e).css({color: sColor})
        })
    }

    /**
     * adjustContent
     * @param {*} html 
     */
    static adjustContent(html) {
        let header = html.find('._sheetHeader')
        const nHeight = header.height() + 20
        html.find('._main').css({height: 'calc(100% - '+nHeight+'px)'})
        //header.find('._headerBackground').css({height: 'calc('+nHeight+'px)'})
    }

    /**
     * addEditButton
     * @param {*} html 
     * @param {*} isPlayMode 
     */
    static addEditButton(html, isPlayMode) {        
        let header = html.find('.window-header')

        if (isPlayMode) {
            header.find('button[data-action="_play"]').remove();
            if (header.find('button[data-action="_edit"]').length === 1) return;

            const sTooltip = game.i18n.localize('common.editarFicha')
            header.find('button[data-action="close"]').before(`
                <button type="button" class="header-control icon fa-solid fa-eye"
                        data-tooltip="${sTooltip}" aria-label="${sTooltip}" data-action="_edit"></button>`)

        } else {
            header.find('button[data-action="_edit"]').remove();
            if (header.find('button[data-action="_play"]').length === 1) return;

            const sTooltip = game.i18n.localize('common.editarFichaNo')
            header.find('button[data-action="close"]').before(`
                <button type="button" class="header-control icon fa-solid fa-pen-to-square"
                        data-tooltip="${sTooltip}" aria-label="${sTooltip}" data-action="_play"></button>`)
        }
    }

    /**
     * addRulesClass
     * @param {*} html 
     * @param {*} document 
     */
    static addRulesClass(html, document) {
        html.addClass('_'+document.system.rules)
    }

    /**
     * hideTitle
     * @param {*} html 
     */
    static hideTitle(html) {
        let title = html.find('.window-title')
        title.hide();
    }
    static showTitle(html) {
        let title = html.find('.window-title')
        title.show();
    }
}