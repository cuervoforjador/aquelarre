import { SYSTEM_ID } from "../../config/uiConstants.js"
import extendActorSheet from "../actor.js";
import helperContext from "../../helper/helperContext.js";
import sheetHandler from "../handler.js";

export default class extendCharacterSheet extends extendActorSheet {

  static templateFolder = "systems/"+SYSTEM_ID+"/templates/character"
  static templateTag = "character"  

  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ['_'+this.templateTag],
    position: { 
      width: 900, 
      height: 700 
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

    if ( !this.isEditable || !this.isEditMode) return;

    html.find('._charTotal').on("change", sheetHandler._onChangeCharTotal.bind(this))
  }  

}