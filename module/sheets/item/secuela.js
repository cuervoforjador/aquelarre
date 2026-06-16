import { SYSTEM_ID } from "../../config/uiConstants.js"
import { configRULES } from "../../config/rules.js";
import extendItem0Sheet from "../item.js";
import helperContext from "../../helper/helperContext.js";

export default class sheetSecuela extends extendItem0Sheet {

  static templateFolder = "systems/"+SYSTEM_ID+"/templates/item"
  static templateTag = "secuela"

  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ['_'+this.templateTag],
    position: { 
        width: 1200
    },     
  }

  /** @override */
  static PARTS = {
    header: { template: `${this.templateFolder}/headers/${this.templateTag}.hbs` },
    main: { template: `${this.templateFolder}/main/${this.templateTag}.hbs` }
  } 
  static TABS = {
    primary: {
      tabs: [ {id: "efectos"}, {id: "descripcion"} ],
      initial: "descripcion"
    }
  }


  /**
   * _prepareContext
   * @override
   */
  async _prepareContext() {
    const rules = this.document.system.rules
    const context = await super._prepareContext()
    context.localizacionesTipos = await helperContext.getLocalizacionesTipos(rules)
    context.localizaciones = await helperContext.getLocalizacionesPartes(rules, this.document.system.localizacionTipo)
    context.efectos = this.document.system.efectos

    context.configRULES = configRULES[rules]
    context.tabs = this._prepareTabs("primary")
    return context
  }

}