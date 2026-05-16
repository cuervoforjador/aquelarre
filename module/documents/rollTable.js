import { SYSTEM_ID } from "../config/uiConstants.js";
import helperTools from "../helper/helperTools.js";
import helperContext from "../helper/helperContext.js";
import helperTables from "../helper/helperTables.js";

export default class newRollTable extends RollTable {

  get isLore() { return this.flags.isLore?.value === true }
  get rules() { return this.flags.rules?.value }
  get lore() { return this.flags.lore?.value }
  get actor() { return helperTools.getActor(this.flags.actorId?.value, this.flags.tokenId?.value) }

  static async createDocuments(data=[], operation={}) {
    let document = await super.createDocuments(data, operation)
    return document
  }

  async draw({roll, recursive=true, results=[], displayChat=true, messageMode, rollMode}={}) {
    const result = await super.draw(roll, recursive, results, displayChat, messageMode, rollMode)
    if (this.isLore) {
      const key = result.results[0].flags.key.value
      await helperContext.assignLoreToActor(this.rules, this.lore, this.actor, key)
      await this.delete()
      this._evaluateSecondRoll()
    }
    return result
  }

  async toMessage(results, {roll, messageData={}, messageOptions={}}={}) {
    if (this.isLore) {
      messageData.flags = {
        isLore: {value: true},
        rules: {value: this.rules},
        lore: {value: this.lore}
      }
    }
    const message = await super.toMessage(results, {roll, messageData, messageOptions})    
    return message    
  }

  async _evaluateSecondRoll() {
    if (this.isLore && this.lore === 'estrato')
        await helperTables.tableLore(this.rules, 'posicion', this.actor)
  }
  
  /*
  async roll({roll, recursive=true, _depth=0}={}) {
    const result = await super.roll(roll, recursive, _depth)
    return result
  }

  async _buildEmbedHTML(config, options={}) {
    const html = await super._buildEmbedHTML(config, options)
    return html
  }

  async _onClickEmbedAction(event, action) {
    await super._onClickEmbedAction(event, action)
  }
  */
}