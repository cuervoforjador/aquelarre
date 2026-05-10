import { SYSTEM_ID } from "../config/uiConstants.js"
import sheetHandler from "./handler.js"
import helperSheets from "../helper/helperSheets.js"

const { HandlebarsApplicationMixin } = foundry.applications.api
export default class extendActorSheet 
             extends HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {

  //Constants...
  static SHEET_MODES = { 
    EDIT: 0, 
    PLAY: 1
  }

  //Attributes...
  _sheetMode = this.constructor.SHEET_MODES.PLAY

  //Events
  #dragDrop

  /**
   * constructor
   * @param {*} options 
   */
  constructor(options = {}) {
    super(options)
  }

  /**
   * DEFAULT_OPTIONS
   * @override 
   */
  static DEFAULT_OPTIONS = {
    classes: ["_extend", "_actor"],
    position: { width: "auto", height: "auto" },
    form: {  submitOnChange: true },
    window: {  resizable: true },
    actions: {
      charX5:                     extendActorSheet.#onCharX5       
    }
  }

  /** gettings... */
  get isPlayMode() { return this._sheetMode === this.constructor.SHEET_MODES.PLAY }
  get isEditMode() { return this._sheetMode === this.constructor.SHEET_MODES.EDIT }

  /**
   * _prepareContext
   * @override
   */
  async _prepareContext() {

    return {
      fields:       this.document.schema.fields,
      systemFields: this.document.system.schema.fields,
      actor:        this.document,
      system:       helperSheets.checkStats(this.document.system),
      source:       this.document.toObject(),
      isGM:         game.user.isGM,
      isEditMode:   this.isEditMode,
      isPlayMode:   this.isPlayMode,
      isEditable:   this.isEditable,
    }    
  }

  /**
   * _onRender
   * @param {*} context 
   * @param {*} options 
   * @override
   */
  _onRender(context, options) {
    super._onRender(context, options)
    helperSheets.drawSpectrum($(this.element))
    this.activateListeners($(this.element))
  }

  /**
   * activateListeners
   * @param {*} html 
   */
  activateListeners(html) {

    if ( !this.isEditable ) return;
    
    html.find('._charTotal').on("change", sheetHandler._onChangeCharTotal.bind(this))
  }
    
  /**
   * onCharX5
   * @param {*} _event 
   * @param {*} target 
   */
  static #onCharX5(_event, target) {
    //if (!this.isEditable) return

  }

}
