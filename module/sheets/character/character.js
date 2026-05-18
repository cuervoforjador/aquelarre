import { SYSTEM_ID } from "../../config/uiConstants.js"
import { configRULES } from "../../config/rules.js";
import extendActorSheet from "../actor.js";
import helperContext from "../../helper/helperContext.js";
import helperSheets from "../../helper/helperSheets.js";
import helperDialog from "../../helper/helperDialog.js";
import helperTables from "../../helper/helperTables.js";
import sheetHandler from "../handler.js";

export default class extendCharacterSheet extends extendActorSheet {

  static templateFolder = "systems/"+SYSTEM_ID+"/templates/character"
  static templateTag = "character"  

  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ['_'+this.templateTag],
    position: { 
      width: 1000, 
      height: 700 
    },
    actions: {
      _editLore:    this.#onEditLore,
      _showStatus:  this.#onShowStatus
    }    
  }

  /** @override */
  static PARTS = {
    header: { template: `${this.templateFolder}/headers/${this.templateTag}.hbs` },
    main: { template: `${this.templateFolder}/main/${this.templateTag}.hbs` }
  }
  static TABS = {
    primary: {
      tabs: [ {id: "stats"}, {id: "combate"} ],
      initial: "stats"
    }
  }  

  /**
   * _prepareContext
   * @override
   */
  async _prepareContext() {
    const rules = this.document.system.rules
    const context = await super._prepareContext()
    context.caracteristicas = helperContext.getCaracteristicas()

    context.info = {...context.info, ...helperSheets.readLoreContext(this.document)}

    context.tabs = this._prepareTabs("primary")
    return context
  }

  /**
   * _onRender
   * @param {*} context 
   * @param {*} options 
   * @override
   */
  async _onRender(context, options) {
    await super._onRender(context, options)
    this.activateListeners($(this.element))
  }


  /**
   * activateListeners
   * @param {*} html 
   */
  activateListeners(html) {
    super.activateListeners(html)

    if ( !this.isEditable || !this.isEditMode) return;

    html.find('._charTotal').on("change", sheetHandler._onChangeCharTotal.bind(this))
  }  

  /**
   * onEditLore
   * @param {*} _event 
   * @param {*} target 
   */
  static async #onEditLore(_event, target) {
    const lore = $(target).data('lore')
    const rules = this.document.system.rules
    
    if (lore !== 'posicion' || !configRULES[rules].estratoRoll) {

      const option = await helperDialog.dialogSelectLore(rules, lore, this.document)
      if (!option) return
      if (option === '#alea') await helperTables.tableLore(rules, lore, this.document)
                         else await helperContext.assignLoreToActor(rules, lore, this.document, option)

    } else {

      const optionEstrato = await helperDialog.dialogSelectLore(rules, 'estrato', this.document)
      if (!optionEstrato) return
      if (optionEstrato === '#alea') await helperTables.tableLore(rules, 'estrato', this.document)
      else {
        await helperContext.assignLoreToActor(rules, 'estrato', this.document, optionEstrato)
        const optionPosicion = await helperDialog.dialogSelectLore(rules, 'posicion', this.document)
        if (!optionPosicion) return
        if (optionPosicion === '#alea') await helperTables.tableLore(rules, 'posicion', this.document)
                                    else await helperContext.assignLoreToActor(rules, 'posicion', this.document, optionPosicion)
      }   
    }
  }  

  /**
   * onShowStatus
   * @param {*} _event 
   * @param {*} target 
   */
  static async #onShowStatus(_event, target) {
    const path = $(target).data('path')
    const key = path.split('.').splice(-1)[0]
    let data = this.document
    path.split('.').map(s => {data = data[s]})
    const content = `<p>${game.i18n.localize('common.penalMov')}: <strong>x ${data.penalMov}</strong></br>       
                        ${game.i18n.localize('common.penalDan')}: <strong>x ${data.penalDan}</strong></br>
                        ${game.i18n.localize('common.penalHab')}: <strong>- ${data.penalHab}%</strong></br>
                        ${game.i18n.localize('common.penalIni')}: <strong>- ${data.penalIni} x AGI</strong></p>
                     <p>${game.i18n.localize('explain.'+key)}</p>`
                            
    helperDialog.dialogDescription(null, content, game.i18n.localize('common.'+key), this.document.system.rules, 300)
  }

}