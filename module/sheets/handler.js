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

}