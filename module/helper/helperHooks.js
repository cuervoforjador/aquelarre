import _hooksReady from '../hooks/ready.js'
import _hooksSetup from '../hooks/setup.js'
import hooksFolders from '../hooks/folders.js'
import hooksRender from '../hooks/render.js'
import hooksActor from '../hooks/actor.js'

export default class helperHooks {

    /**
     * initHooks
     */
    static initHooks() {

        Hooks.once('ready', _hooksReady)
        Hooks.once('setup', _hooksSetup)

        Hooks.on('activateCompendiumDirectory', hooksFolders.activateCompendiumDirectory.bind(this))
        Hooks.on('renderCompendium', hooksFolders.renderCompendium.bind(this))
        Hooks.on('renderApplicationV2', hooksRender.renderApplicationV2.bind(this))
        Hooks.on('createActor', hooksActor.createActor.bind(this) )
    }

}