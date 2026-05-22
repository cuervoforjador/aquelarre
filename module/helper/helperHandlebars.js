import { SYSTEM_ID } from "../config/uiConstants.js"
import { configRULES } from "../config/rules.js"

export default class helperHandlebars {

/**
 * define
 */
static define() {

    //concat
    Handlebars.registerHelper("concat", (...args) => args.slice(0, -1).join(""))
    Handlebars.registerHelper("or", (...args) => args.slice(0, -1).some(Boolean))
    Handlebars.registerHelper("array", (...args) => args.slice(0, -1))

    Handlebars.registerHelper("and", (a, b) => a && b)
    Handlebars.registerHelper("eq", (a, b) => a === b)
    Handlebars.registerHelper("gt", (a, b) => a > b)
    Handlebars.registerHelper("gte", (a, b) => a >= b)
    Handlebars.registerHelper("lt", (a, b) => a < b)
    Handlebars.registerHelper("lte", (a, b) => a <= b)
    
    Handlebars.registerHelper("neg", n => -n)
    Handlebars.registerHelper("abs", n => Math.abs(n))
    Handlebars.registerHelper("add", (a, b) => a + b)
    Handlebars.registerHelper("mult", (a, b) => a * b)
    Handlebars.registerHelper("toUpperCase", (a) => a.toUpperCase())

    Handlebars.registerHelper("assets", () => 'systems/'+SYSTEM_ID+'/assets')

    Handlebars.registerHelper("_disabled", (...args) => {
        const isEditable = args[0].data.root.isEditable
        return (isEditable) ? '' : 'disabled="disabled"'
    })   

    Handlebars.registerHelper("translate", (key, docs) => {
        return Object.keys(docs).map((key) => docs[key]).find(e => e.key === key)?.label
    })

    Handlebars.registerHelper("_value", (...args) => {
        const sPath = args.slice(0, -1).join('.')
        let oData = args[args.length - 1].data.root
        sPath.split('.').map(s => { oData = oData[s]})
        return oData
    })    

    Handlebars.registerHelper("navTab", (...args) => {
        const group = args[0]
        const tabs = args[1]
        const sClass = args[2] ? args[2] : ''
        let links = "";
        tabs.map(tab => {
            links += `<a data-action="tab" data-group="${group}" data-tab="${tab}">${game.i18n.localize('common.'+tab)}</a>`
        })
        return `<nav class="tabs ${sClass}" data-group="${group}">${links}</nav>`
    })

    Handlebars.registerHelper("checkButton", (...args) => {
        const path = args[0]
        const tooltip = game.i18n.localize(args[1])
        const icon = args[2]
        const document = args[3].data.root
        const isEditable = document.isEditable        
        let property = document;
        path.split('.').map(s => {property = property[s]})

        return `<input name="${path}" 
                    style="display: none"
                    type="checkbox"
                    ${property ? " checked " : ""} /> 
                <button type="button" 
                        class="icon fas ${icon} ${property ? "_checked" : ""}" 
                        ${isEditable ? 'data-action="_checkButton"' : 'disabled="disabled"'}
                        data-path="${path}"
                        data-tooltip="${tooltip}"
                        aria-label="${tooltip}">
                </button>`;
    })

    Handlebars.registerHelper("sheetRules", (root) => {
        const document = root.data.root
        return game.i18n.localize('RULES.'+document.system.rules)
    })    

    Handlebars.registerHelper("isCharVisible", (key, root) => {
        const document = root.data.root
        const rules = document.system.rules
        if (configRULES[rules].chars.find(e => e === key)) return true
                                                           return false
    })

}
}