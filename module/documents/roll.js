import { SYSTEM_ID } from "../config/uiConstants.js";

export default class newRoll extends Roll {

  /** @override */
  async render(chatOptions = {}) {
    return super.render(chatOptions)
  }

  /** @override */
  async toMessage(messageData = {}, { messageMode, rollMode, create = true } = {}) {
    return super.toMessage(messageData, messageMode, rollMode, create)
  }


}