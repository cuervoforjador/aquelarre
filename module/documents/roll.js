import { SYSTEM_ID } from "../config/uiConstants.js";
import helperDialog from "../helper/helperDialog.js";
import newChatMessage from "./chatMessage.js";


export default class newRoll extends Roll {

  get rollType() { return this.data.rollType ? this.data.rollType : 'simple' }
  get percent() { return this.data.percent ? this.data.percent : 0 }
  get useDiffLevel() { return this.data.useDiffLevel ? this.data.useDiffLevel : false }
  get useLuck() { return this.data.useluck ? this.data.useluck : false }
  get rules() { return this.data.actor?.system.rules ? this.data.actor.system.rules : 'aq3'}
  get actor() { return this.data.actor ? this.data.actor : null }
  get title() { return this.data.title ? this.data.title : '' }
  get subtitle() { return this.data.subtitle ? this.data.subtitle : '' }

  critical = {
    maxCriticalSuccess: 1,
    minCriticalFailure: 100
  }
  evaluatedResult = {
    percentBase: 0,
    percentFinal: 0,
    succes: false,
    failure: true,
    criticalSuccess: false,
    criticalFailure: false,
    text: game.i18n.localize('common.fallo'),
    class: 'failue'
  }
  diffLevel = {
    use: false,
    action: 'diff00',
    penal: '+0',
    title: game.i18n.localize('common.diffNormal')
  } 
  luck = {
    use: false,
    initial: 0,
    end: 0,
    spent: 0,
    evaluated: false
  } 
  mods = []

  /** @override */
  constructor(formula="", data={}, options={}) {
    super(formula, data, options)
  }

  /**
   * rollit
   */
  async rollit() {
    let rendered = false
    if (this.useDiffLevel || useLuck) { rendered = await this.askDiffLevel() }
    if (!rendered) return
    await this.evaluate()
    if (game.dice3d) await game.dice3d.showForRoll(this)
    this._evalResult()
    this._spendLuck()
    this.postMessage()
  }

  /**
   * _evalResult
   */
  _evalResult() {
      let nPercent = this.percent
      this.mods.map(mod => { nPercent = nPercent + Number(mod.penal) })
      nPercent = nPercent + Number(this.diffLevel.penal)
      let nTotalLuck = this.total - this.luck.spent

      const maxCS = Math.ceil(nPercent/10)
      const minCF = Math.ceil(100 - (Math.ceil((100 - nPercent + 1)/10) - 1))
      this.critical = {...this.critical, ...{
        maxCriticalSuccess: maxCS > 0 ? maxCS : 1,
        minCriticalFailure: minCF > 99 ? 100 : minCF,
      }}

      this.evaluatedResult = {...this.evaluatedResult, ...{
        percentBase: this.percent,
        percentFinal: nPercent,
        succes: nTotalLuck <= nPercent,
        failure: nTotalLuck > nPercent,
        criticalSuccess: nTotalLuck <= this.critical.maxCriticalSuccess,
        criticalFailure: nTotalLuck >= this.critical.minCriticalFailure      
      }}
      if (this.evaluatedResult.criticalSuccess) {
        this.evaluatedResult.succes = true; 
        this.evaluatedResult.failure = false;
      }
      if (this.evaluatedResult.criticalFailure) {
        this.evaluatedResult.succes = false; 
        this.evaluatedResult.failure = true;      
      }
      this.evaluatedResult.text = this.evaluatedResult.criticalSuccess ? game.i18n.localize('common.criticalSuccess') :
                                  this.evaluatedResult.criticalFailure ? game.i18n.localize('common.criticalFailure') :
                                  this.evaluatedResult.succes ? game.i18n.localize('common.exito') : game.i18n.localize('common.fallo')
      this.evaluatedResult.class = this.evaluatedResult.criticalSuccess ? 'criticalSuccess' :
                                   this.evaluatedResult.criticalFailure ? 'criticalFailure' :
                                   this.evaluatedResult.succes ? 'success' : 'failure'     
      
      // Suerte
      if (this.luck.use && !this.luck.evaluated) {
        this.luck.evaluated = true
        if (this.evaluatedResult.succes) this.luck.spent = 1
                                    else this.luck.spent = this.total - nPercent
        this.luck.initial = this.actor.system.atributos.sue.value
        this.luck.end = this.luck.initial - this.luck.spent
        if (this.luck.end < 0) {
          this.luck.end = 0
          this.luck.spent = this.luck.initial
        }
        if (this.luck.spent > 0 && this.evaluatedResult.failure
                                && !this.evaluatedResult.criticalFailure) this._evalResult()
      }
  }

  /**
   * askDiffLevel
   */
  async askDiffLevel() {

    let content = this.useLuck ? `<ul class="_main">
                                    <li data-key="luck" data-tooltip="${game.i18n.localize("common.suerteActual")}: ${this.actor.system.atributos.sue.value}">
                                        <input type="checkbox" class="_selector" id="selector">
                                        <label class="_title" for="selector">${game.i18n.localize("common.useLuck")}</label>
                                    </li>
                                 </ul>` 
                                 : ''

    let mButtons = []
    this._diffLevelsMatrix().map(level => {
      mButtons.push({
        label: level.title,
        tooltip: this.percent+'% '+level.penal+'% = '+(this.percent + Number(level.penal))+'%',
        class: level.action,
        action: level.action,
        default: level.action === 'diff00',
        callback: (_event, button) => {
          return {
            action: $(button).data('action'),
            useLuck: $(_event.currentTarget).find('input[type="checkbox"]._selector').prop('checked')
          }
        }
      })
    })

    const result = await foundry.applications.api.DialogV2.wait({
      classes: ['_extend', '_diffLevels', '_'+this.rules],
      window: { title: game.i18n.localize("common.dificultad") },
      position: { width: 250, height: 'auto' },
      content: content,
      buttons: mButtons,
      render: (_event, dialog) => {
        $(dialog.element).find('footer button').each((i,e) => {
          const _class = $(e).attr('class')
          const option = dialog.options.buttons[_class]
          $(e).data('tooltip', option.tooltip)
          $(e).attr('data-tooltip', option.tooltip)
        })    
        helperDialog._setShadowToDialog(dialog)
      }
    })
    if (!result) return false
    this.diffLevel.use = true
    this.diffLevel = {...this.diffLevel, ...this._diffLevelsMatrix().find(e => e.action === result.action)}
    this.luck.use = result.useLuck
    return true
  }

  /** @override */
  async render(chatOptions = {}) {
    return super.render(chatOptions)
  }

  /** @override */
  async toMessage(messageData = {}, { messageMode, rollMode, create = true } = {}) {
    return super.toMessage(messageData, messageMode, rollMode, create)
  }

  /**
   * _spendLuck
   * @returns 
   */
  async _spendLuck() {
    if (!this.actor || !this.luck.use) return
    await this.actor.update({"system.atributos.sue.value": this.luck.end})
  }

  /**
   * postMessage
   */
  async postMessage() {

    let sHeader = ""
    let sResult = ""    
    let dices = ""
    this.terms.map(die => {
      dices += `<li class="roll die ${die.denomination}">${die.total}</li>`
    })


    
    switch(this.rollType) {
      case 'simple':

        sHeader += this.actor ?    
                        `<div class="_header">
                              <img src="${this.actor.img}">
                              <div class="_subHeader">
                                <h2>${this.title}</h2>
                                <h4>${this.subtitle}</h4>
                              </div>
                        </div>` :
                        `<div class="_header">
                            <div class="_totalHeader">
                                <h2>${this.title}</h2>
                                <h4>${this.subtitletitle}</h4>                              
                            </div>
                        </div>`

        const sLuckStats = `<div class="_row">
                        <label>${game.i18n.localize('common.suerteGastada')}:</label>
                        <label class="_field">${this.luck.spent}</label>
                      </div>
                      <div class="_row">
                        <label>${game.i18n.localize('common.suerteInicial')}:</label>
                        <label class="_field">${this.luck.initial}</label>
                      </div>    
                      <div class="_row">
                        <label>${game.i18n.localize('common.suerteActual')}:</label>
                        <label class="_field">${this.luck.end}</label>
                      </div>                                                              
                      `
        sResult +=      `<div class="dice-roll" data-action="expandRoll">
                              <div class="dice-result">
                                  <div class="dice-formula" style="">${this.formula}</div>
                                  <div class="dice-tooltip">
                                      <div class="wrapper">
                                          <section class="tooltip-part">
                                              <div class="_stats">
                                                <div class="_row">
                                                  <label>${game.i18n.localize('common.base')}:</label>
                                                  <label class="_field">${this.evaluatedResult.percentBase}%</label>
                                                </div>
                                                <div class="_row">
                                                  <label>${game.i18n.localize('common.dificultad')}:</label>
                                                  <label class="_field">${this.diffLevel.title} (${this.diffLevel.penal}%)</label>
                                                </div>
                                                <div class="_row">
                                                  <label>${game.i18n.localize('common.usaSuerte')}:</label>
                                                  <label class="_field">${this.luck.use ? game.i18n.localize('common.si') :
                                                                                          game.i18n.localize('common.no')}</label>
                                                </div>
                                                ${this.luck.use ? sLuckStats : ''}
                                                <div class="_row">
                                                  <label>${game.i18n.localize('common.porcentajeFinal')}:</label>
                                                  <label class="_field">${this.evaluatedResult.percentFinal}%</label>
                                                </div>                                                
                                                <div class="_row">
                                                  <label>${game.i18n.localize('common.criticalSuccess')}:</label>
                                                  <label class="_field"> 0% - ${this.critical.maxCriticalSuccess}%</label>
                                                </div>
                                                <div class="_row">
                                                  <label>${game.i18n.localize('common.exito')}:</label>
                                                  <label class="_field"> ${this.evaluatedResult.percentFinal < 2 ? '0' :
                                                                           this.critical.maxCriticalSuccess + 1}% - ${this.evaluatedResult.percentFinal > 99 ? 99 : 
                                                                                                                      this.evaluatedResult.percentFinal < 2 ? '0' :
                                                                                                                      this.evaluatedResult.percentFinal}%</label>
                                                </div> 
                                                <div class="_row">
                                                  <label>${game.i18n.localize('common.fallo')}:</label>
                                                  <label class="_field"> ${this.evaluatedResult.percentFinal < 2 ? 2 :
                                                                           this.evaluatedResult.percentFinal > 99 ? '0' :  
                                                                           this.evaluatedResult.percentFinal + 1}% - ${this.evaluatedResult.percentFinal > 99 ? '0' : 
                                                                                                                       this.critical.minCriticalFailure - 1}%</label>
                                                </div> 
                                                <div class="_row">
                                                  <label>${game.i18n.localize('common.criticalFailure')}:</label>
                                                  <label class="_field">${this.critical.minCriticalFailure}% - 100%</label>
                                                </div>                                                                                                                                              
                                              </div>
                                          </section>
                                      </div>    
                                  </div>
                                  <h4 class="dice-total">
                                        ${this.luck.use ? `<i class="fa-solid fa-horseshoe lucky" data-tooltip="${game.i18n.localize('common.suerteGastada')+': '+this.luck.spent}"></i>` : '' }
                                        <span class="_number"> ${this.total} <span class="_percent"> / ${this.evaluatedResult.percentFinal}</span></span><span class="_result ${this.evaluatedResult.class}">${this.evaluatedResult.text}</span></h4>
                              </div>
                          </div>`
        break;
    }

    const message = await newChatMessage.create({
      content: sHeader + sResult,
      title: this.title,
      flags: {
        "actorId": {"value": this.actor ? this.actor.id : ''},
        "tokenId": {"value": this.actor && this.actor.token ? this.actor.token.id : ''}
      }
    })
    

  }

  /**
   * _diffLevelsMatrix
   */
  _diffLevelsMatrix() {
    return [
      {title: game.i18n.localize("common.diffInfalible"), penal: '+75', action: "diffB3"},
      {title: game.i18n.localize("common.diffMuyFacil"), penal: '+50', action: "diffB2"},
      {title: game.i18n.localize("common.diffFacil"), penal: '+25', action: "diffB1"},
      {title: game.i18n.localize("common.diffNormal"), penal: '+0',  action: "diff00"},
      {title: game.i18n.localize("common.diffDificil"), penal: '-25', action: "diffP1"},
      {title: game.i18n.localize("common.diffMuyDificil"), penal: '-50', action: "diffP2"},
      {title: game.i18n.localize("common.diffImposible"), penal: '-75', action: "diffP3"}
    ]
  }

}