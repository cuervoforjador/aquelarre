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
import sheetTableExtend from "../sheets/table/base.js"

import helperContext from "./helperContext.js"
import helperDialog from "./helperDialog.js"

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

        const vT = foundry.documents.collections.RollTables
        vT.registerSheet(SYSTEM_ID, sheetTableExtend, { types: ["base"], makeDefault: true, label: "sheet.lore" })

    }

    /**
     * checkStats
     * @param {*} system 
     */
    static checkStats(system) {

        let _attrs = system.atributos,
            _chars = system.caracteristicas;

        //Características
        for (var s in _chars) {
            let char = _chars[s];
            ['value', 'total'].map(field => {
                char[field] = this._checkMinMax(char[field], char.min, char.max)
            })             
        }

        //Suerte
        _attrs.sue.total = _chars.com.value + _chars.per.value + _chars.cul.value;
        _attrs.sue.max = _attrs.sue.total 
        _attrs.sue.value = this._checkMinMax(_attrs.sue.value, _attrs.sue.min, _attrs.sue.max)

        //Pt. Vida
        _attrs.ptv.total = _chars.res.value
        _attrs.ptv.max = _attrs.ptv.total
        _attrs.ptv.min = _attrs.ptv.total * (-1)
        _attrs.ptv.value = this._checkMinMax(_attrs.ptv.value, _attrs.ptv.min, _attrs.ptv.max)

        //Altura y Peso
        const charEval = _chars.fue.value > _chars.res.value ? _chars.fue.value : _chars.res.value;
        system.info.altura = Math.round(charEval*2.49 + 139.36)/100;
        system.info.peso =  Math.round(charEval*3.72 + 88.49);
        [[5,106], [6,110], [7,118], [8,120], [9,122], [10,125], [11,128], [12,132], [13,134], [14,140], [15,146]].map(e => {
            if (charEval === e[0]) system.info.peso = e[1]
        })
        
        //Templanza
        _attrs.tem.min = 0
        _attrs.tem.max = 100       
        _attrs.tem.total = this._checkMinMax(_attrs.tem.total, _attrs.rr.min, _attrs.rr.max)
        _attrs.tem.value = _attrs.tem.total

        //Racionalidad e Irracionalidad
        _attrs.rr.min = 0
        _attrs.rr.max = 200
        _attrs.rr.value = this._checkMinMax(_attrs.rr.value, _attrs.rr.min, _attrs.rr.max)

        _attrs.irr.min = 0
        _attrs.irr.max = 200
        _attrs.irr.value = this._checkMinMax(_attrs.irr.value, _attrs.irr.min, _attrs.irr.max)

        //Pt. Concentración y Fe
        _attrs.ptc.total = Math.ceil(_attrs.irr.value * 0.2)
        _attrs.ptc.min = 0
        _attrs.ptc.max = _attrs.ptc.total
        _attrs.ptc.value = this._checkMinMax(_attrs.ptc.value, _attrs.ptc.min, _attrs.ptc.max)

        _attrs.ptf.total = Math.ceil(_attrs.rr.value * 0.2)
        _attrs.ptf.min = 0
        _attrs.ptf.max = _attrs.ptf.total        
        _attrs.ptf.value = this._checkMinMax(_attrs.ptf.value, _attrs.ptf.min, _attrs.ptf.max)

        //Estatus de Vida
        const ptv =  system.atributos.ptv
        for (var s in system.salud.estado) {
            let status = system.salud.estado[s]
            status.checked = false

            const low = ptv.total - Math.ceil(ptv.total * status.low)
            const high = ptv.total - Math.ceil(ptv.total * status.high)
            status.value = high
            if (ptv.value <= high && ptv.value > low) status.checked = true
        }

        return system
    }

    static _checkMinMax(val, min, max) {
        return  Number(val) < min ? min :
                Number(val) > max ? max : Number(val);
    }

    /**
     * drawSpectrum
     * @param {*} html 
     */
    static drawSpectrum(html) {
        html.find('[data-spectrum="true"]').each( (i,e) => {
            let value = Number($(e).find('span._value').html())
            value = value > 100 ? 100 : isNaN(value) ? 0 : value
            let hex = Math.round((value / 100)*255).toString(16);
                hex = hex.length === 1 ? '0' + hex : hex;
            const sColor = '#'+hex + '0000' //'#FF' + hex + hex;
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
        //html.find('._sheetHeader .portrait').css({
        //                height: 'calc('+nHeight+'px - 20px)',
        //                width: 'calc('+nHeight+'px - 20px)' })
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
                <button type="button" class="header-control icon fa-solid fa-lock"
                        data-tooltip="${sTooltip}" aria-label="${sTooltip}" data-action="_edit"></button>`)

        } else {
            header.find('button[data-action="_edit"]').remove();
            if (header.find('button[data-action="_play"]').length === 1) return;

            const sTooltip = game.i18n.localize('common.editarFichaNo')
            header.find('button[data-action="close"]').before(`
                <button type="button" class="header-control icon fa-solid fa-unlock"
                        data-tooltip="${sTooltip}" aria-label="${sTooltip}" data-action="_play"></button>`)
        }
    }

    /**
     * addRulesButton
     * @param {*} html 
     */
    static addRulesButton(html) {
        let header = html.find('.window-header')
        if (header.find('button[data-action="_rules"]').length === 1) return;
        const sTooltip = game.i18n.localize('common.editarReglas')
        header.find('button[data-action="close"]').before(`
            <button type="button" class="header-control icon fa-solid fa-circles-overlap-3"
                    data-tooltip="${sTooltip}" aria-label="${sTooltip}" data-action="_rules"></button>`)        
    }

    /**
     * addTextSizeButton
     * @param {*} html 
     */
    static addTextSizeButton(html) {
        let header = html.find('.window-header')
        if (header.find('button[data-action="_textsize"]').length === 1) return;
        const sTooltip = game.i18n.localize('common.editarTamano')
        header.find('button[data-action="close"]').before(`
            <button type="button" class="header-control icon fa-solid fa-text-size"
                    data-tooltip="${sTooltip}" aria-label="${sTooltip}" data-action="_textsize"></button>`)        
    }

    /**
     * adjustTextSize
     * @param {*} html 
     * @param {*} document 
     */
    static adjustTextSize(html, document) {
        const size = document.system.control.textSize
        html[0].style.setProperty('--fSize', size)
    }

    /**
     * changeTextSize
     * @param {*} document 
     */
    static async changeTextSize(document) {
        const rules = document.system.rules
        const sContent = `<div class="_main">
                            <div class="_row _spaced">
                                <label>${game.i18n.localize('common.tamanoLetra')}</label>
                                <input type="text" name="textsize" class="_sInput" value="${document.system.control.textSize}"/>
                            </div>
                          </div>`

        const textSize = await foundry.applications.api.DialogV2.wait({
            classes: ['_extend', '_'+rules],
            window: { title: game.i18n.localize("common.tamanoLetra") },
            content: sContent,
            buttons: [{
                label: game.i18n.localize("common.confirmar"),
                callback: (event, button) => {
                    return $(event.currentTarget).find('input[name="textsize"]').val()
                }                
            }],
            render: (_event, dialog) => {              
                helperDialog._setShadowToDialog(dialog)
            }            
        })
        if (!textSize) return
        document.update({"system.control.textSize": textSize})
    }

    /**
     * addRulesClass
     * @param {*} html 
     * @param {*} document 
     */
    static addRulesClass(html, document) {
        const mRules = game.settings.settings.get('aquelarre.rules').choices
        for (var s in mRules) { html.removeClass('_'+s) }
        html.addClass('_'+document.system.rules)
    }

    /**
     * changeRules
     * @param {*} document 
     */
    static async changeRules(document) {
        const rules0 = document.system.rules
        const rules = await helperDialog.dialogSelectRules(document)
        if (!rules || rules === rules0) return

        const confirmation = await foundry.applications.api.DialogV2.confirm({
            classes: ['_extend', '_'+rules0],
            window: { title: game.i18n.localize("common.rules") },
            position: { height: 'auto' },
            content: `<p>${game.i18n.localize("explain.cambiarReglas")}</p>`,
            yes: () => {return true},
            no: () => {return false},
            defaultYes: false
        })
        if (!confirmation) return

        await helperContext.deleteAllContext(document)        
        await document.update({"system.rules": rules})
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

    /**
     * readLoreContext
     * @param {*} document 
     */
    static readLoreContext(document) {
        let info = {};
        [
            {type: 'reino', field: 'reino'},
            {type: 'pueblo', field: 'origen'},
            {type: 'sociedad', field: 'cultura'},
            {type: 'estrato', field: 'estamento'},
            {type: 'posicion', field: 'posicion'},
            {type: 'profesion', field: 'profesion'},
            {type: 'profesion', field: 'profesionPaterna'}

        ].map(o => {
            const oItem = document.items.find(e => e.type === o.type)
            info[o.field] = {
                id: '',
                key: '',
                label: game.i18n.localize('common.noItem'),
                img: "systems/"+SYSTEM_ID+"/assets/svg/cancel.svg"
            } 
            if (oItem) {
                info[o.field] = {...info[o.field], ...{
                    id: oItem.id,
                    key: oItem.system.key,
                    label: oItem.name,
                    img: oItem.img
                }}
            } 
        })

        return info
    }
}