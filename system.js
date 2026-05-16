import { SYSTEM_ID } from './module/config/uiConstants.js'
import helperHooks from './module/helper/helperHooks.js'
import helperInitialization from './module/helper/helperInitialization.js'
import helperModels from './module/helper/helperModels.js'
import helperSheets from './module/helper/helperSheets.js'
import helperSettings from './module/helper/helperSettings.js'
import helperHandlebars from './module/helper/helperHandlebars.js'
import helperTemplates from './module/helper/helperTemplates.js'
import helperTokens from './module/helper/helperTokens.js'


helperHooks.initHooks();
Hooks.once("init", () => {

    //CONFIG.debug.hooks = true;

    helperInitialization.loader()
    helperInitialization.config()
    helperSettings.register()
    helperModels.initModels()    
    helperModels.setDocumentClasses()
    helperSheets.initSheets()
    helperHandlebars.define()
    helperTokens.configTrackableAttributes()
    helperTemplates.preload()
});

