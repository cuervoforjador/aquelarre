import { SYSTEM_ID } from "../../config/uiConstants.js"
import extendItem0Sheet from "../item.js";
import helperContext from "../../helper/helperContext.js";
import { aqConfig } from "../../config/config.js";
import { configRULES } from "../../config/rules.js";
import helperTools from "../../helper/helperTools.js";

export default class sheetProfesion extends extendItem0Sheet {

  static templateFolder = "systems/"+SYSTEM_ID+"/templates/item"
  static templateTag = "profesion"

  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ['_'+this.templateTag],
    position: { 
      width: 950,  
      height: 700
    },        
    actions: {
      _clearSkills: this.#onClearSkills,
      _clearChars: this.#onClearChars 
    },    
  }

  /** @override */
  static PARTS = {
    header: { template: `${this.templateFolder}/headers/${this.templateTag}.hbs` },
    main: { template: `${this.templateFolder}/main/${this.templateTag}.hbs` }
  } 
  static TABS = {
    primary: {
      tabs: [ {id: "caracteristicas"}, {id: "competencias"}, {id: "descripcion"} ],
      initial: "caracteristicas"
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
    context.competencias = await helperContext.getCompetenciasObject(rules)
    context.estratos = await helperContext.getEstratosExpanded(rules)

    var nIndex = 0
    for (var s in context.competencias) {
        context.competencias[s].index = nIndex
        nIndex++
    }
    nIndex = 0
    for (var s in context.estratos) {
        context.estratos[s].index = nIndex
        nIndex++
    }    

    context.tabs = this._prepareTabs("primary")
    return context

  }

  static async #onClearSkills(_event, target) {

    let mSkills = this.document.system.competencias
    mSkills.map(e => {
      e.primaria = false;
      e.secundaria = false;
      e.alternativa = false;
      e.grupo = '';
    })
    await this.document.update({"system.competencias": mSkills})
  }

  static async #onClearChars(_event, target) {

    let oSystem = this.document.system

    let mStratos = oSystem.estratos
    mStratos.map(e => {
      e.checked = false;
      e.ingresos = '';
    })
    await this.document.update({"system.estratos": mStratos})    

    for (var s in oSystem.caracteristicas) {
      oSystem.caracteristicas[s] = 0
    }
    await this.document.update({"system.caracteristicas": oSystem.caracteristicas})

  }

}