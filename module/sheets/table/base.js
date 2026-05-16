const { HandlebarsApplicationMixin } = foundry.applications.api
export default class sheetTableExtend
             extends foundry.applications.sheets.RollTableSheet {

  static DEFAULT_OPTIONS = {
    classes: ["_extend"]
  }

  /** @override */
  async _onRender(context, options) {
    await super._onRender(context, options)    
    this._addClasses()
    this._hideTitle()
  }  

  _addClasses() {
    if (this.document.isLore) {        
        $(this.element).addClass('_extend')
        $(this.element).addClass('_lore')
        $(this.element).addClass('_'+this.document.rules)
    }
  }

  _hideTitle() {
        $(this.element).find('.window-title').hide();    
  }

}