import helperContext from "../helper/helperContext.js";

export default class sheetHandler {

  /**
   * _onChangeCharTotal
   * @param {*} event 
   */
  static async _onChangeCharTotal(event) {
    const target = event.currentTarget
    const char = target.name.split('.')[2]
    const path = "system.caracteristicas."+char+".value"
    await this.actor.update({[path]: target.valueAsNumber});
  }

  /**
   * _onChangeReino
   * @param {*} event 
   */
  static async _onChangeReino(event) {
    const key = $(event.currentTarget).find(':selected').val()
    const rules = this.document.system.rules

    const mDocs = await helperContext.getFromCompendium(rules, 'reino')
    const item = mDocs.find(e => e.system.key === key)

    for (const oItem of this.document.items.filter(e => e.type === 'reino' && e.system.key !== key)) {
      await oItem.delete()
    }
    if (this.document.items.find(e => e.system.key === key)) return
    await Item.create(item, {parent: this.document})
    this.document.sheet.render(true)
  }

}