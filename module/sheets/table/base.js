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
    if (this.document.isLore && this.document.rules === 'vyc') {
      $(this.element).find('.window-content table tr').each((i,e) => {
        const src = $(e).find('td.image img').attr('src')
        $(e).find('td.image').remove()
        $(e).find('td.details').append(`<div class="_watermark" style="background: url(${src})"></div>`)
        //$(e).css('background-image', 'url(' + src + ')')
      })
    }
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