import { SYSTEM_ID } from "../config/uiConstants.js"
import sheetHandler from "./handler.js"
import helperSheets from "../helper/helperSheets.js"
import helperContext from "../helper/helperContext.js";

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
    position: { 
      width: "600", 
      height: "600" 
    },
    form: {  submitOnChange: true },
    window: {  resizable: true },
    actions: {
      _edit:          this.#onEditSheet,
      _play:          this.#onPlaySheet,
      _readKey:       this.#onReadKey,
      _checkButton:   this.#onBooleanField,
      _addRow:        this.#onAddRow,
      _deleteRow:     this.#onDeleteRow    
    }
  }

  /** gettings... */
  get isPlayMode() { return this._sheetMode === this.constructor.SHEET_MODES.PLAY }
  get isEditMode() { return this._sheetMode === this.constructor.SHEET_MODES.EDIT }

  static #onEditSheet(_event, target) {
    this._sheetMode = this.constructor.SHEET_MODES.EDIT
    this.document.sheet.render(true)
  }

  static #onPlaySheet(_event, target) {
    this._sheetMode = this.constructor.SHEET_MODES.PLAY
    this.document.sheet.render(true)
  }

  static async #onReadKey(_event, target) {
    const sTarget = $(event.currentTarget).parent().find('input[name="name"]')
    let sKey = sTarget.val().replaceAll(' ', '_').toLowerCase()
    let mDocs = await helperContext.getFromCompendium(this.document.system.rules)
    if (mDocs.find(e => e.system.key === sKey)) sKey = ''
    await this.document.update({"system.key": sKey})
  }

  static async #onBooleanField(_event, target) {
    const path = $(target).data('path')
    let property = this.document;
    path.split('.').map(s => { property = property[s] })
    this.document.update({[path]: !property})
    this.document.sheet.render(true)
  }

  static async #onAddRow(_event, target) {
    const path = $(target).parents('._table').data('path')
    let mRows = this._access(this.document, path)

    let row = {}
    $(target).parent().parent().find('[data-field]').each((i,e) => {
      const field = $(e).data('field')
      row[field] = $(e).val()
    })    
    const index = mRows.findIndex(e => e.key === row.key)
    if (index >= 0) mRows[index] = row
               else mRows.push(row)
    await this.document.update({[path]: mRows})
  }  

  static async #onDeleteRow(_event, target) {
    const path = $(target).parents('._table').data('path')
    let mItems = this._access(this.document, path)
    const index = mItems.findIndex(e => e.key === $(target).parents('tr').data('key'))
    mItems.splice(index, 1)
    await this.document.update({[path]: mItems})
  }  

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
      isEditMode:   this.isEditMode,
      isPlayMode:   this.isPlayMode,
      isEditable:   this.isEditable && this._sheetMode === 0,
      isGM:         game.user.isGM,
      rules:        helperContext.getRules()

    }    
  }

  /**
   * textImplentation
   */
  static async textImplentation(field, document) {
      return await foundry.applications.ux.TextEditor.implementation.enrichHTML(
                          document.system[field], { relativeTo: document }) 
  }

  /**
   * title
   * @override
   */
  get title() {
    return this.document.name
  }

  /**
   * minimize
   */
  async minimize() {
    helperSheets.showTitle($(this.document.sheet.element))
    super.minimize()
  }

  /**
   * maximize
   */
  async maximize() {
    helperSheets.hideTitle($(this.document.sheet.element))
    super.maximize()
  }  

  /**
   * _onRender
   * @param {*} context 
   * @param {*} options 
   * @override
   */
  async _onRender(context, options) {
    await super._onRender(context, options)
    helperSheets.addRulesClass($(this.element), this.document)
    helperSheets.hideTitle($(this.element))
    helperSheets.adjustContent($(this.element))
    helperSheets.addEditButton($(this.element), this.isPlayMode)    
    helperSheets.drawSpectrum($(this.element))
    this.activateListeners($(this.element))
    this.activateTab(context, $(this.element))
  }

  /**
   * activateListeners
   * @param {*} html 
   */
  activateListeners(html) {

    if ( !this.isEditable || !this.isEditMode) return;
    
    /** --- SORTABLES --- */
    if (html.find('table._sortable').length > 0) {
      html.find('table._sortable tbody').sortable({
        item: '> tr._sortable',
        forcePlaceholderSize: true,
        placeholder: '_sortTR',
        cursor: 'pointer',
        axis: 'y',
        stop: this._dropTableTR.bind(this)
      })
    }

    /*** --- */
    html.find('._charTotal').on("change", sheetHandler._onChangeCharTotal.bind(this))
  }
    
  /**
   * activateTab
   * @param {*} context 
   * @param {*} html 
   */
  activateTab(context, html) {
    for (var s in context.tabs) { if (context.tabs[s].active) {
      const tab = context.tabs[s];
      html.find(`.tab[data-group="${tab.group}"][data-tab="${tab.id}"],
                 a[data-action="tab"][data-group="${tab.group}"][data-tab="${tab.id}"]`).each((i,e) => {
        $(e).addClass(tab.cssClass)
      })
    }}
  }

  /**
   * _dropTableTR
   * @param {*} event 
   * @param {*} ui 
   */
  async _dropTableTR(event, ui) {
    const path = $(event.target).parents('._table').data('path')
    let mItems = this._access(this.document, path)

    const oldIndex = mItems.findIndex(e => e.key === ui.item.data('key'))
    const newIndex = $(event.target).find('tr').index(ui.item)
    const item = mItems[oldIndex]
    
    mItems.splice(oldIndex, 1)
    mItems.splice(newIndex, 0, item)
    await this.document.update({[path]: mItems})
  }
  
  /**
   * _access
   * @param {*} object 
   * @param {*} path 
   * @returns 
   */
  _access(object, path) {
    let oReturn = object
    path.split('.').map(s => { oReturn = oReturn[s] })
    return oReturn
  }

}
