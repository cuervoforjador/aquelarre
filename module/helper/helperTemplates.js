import { SYSTEM_ID } from "../config/uiConstants.js"

export default class helperTemplates {

    /**
     * preload
     */
    static preload() {

        const base = `systems/${SYSTEM_ID}/templates`
        const character = base + '/character'
        const item = base + '/item'

        foundry.applications.handlebars.loadTemplates({

            main_Actor: `${character}/main.hbs`,

            main_Item: `${item}/main/item.hbs`,
            main_Competencia: `${item}/main/competencia.hbs`,
            main_Sociedad: `${item}/main/sociedad.hbs`,
            main_Pueblo: `${item}/main/pueblo.hbs`,
            main_Reino: `${item}/main/reino.hbs`,
            main_Estrato: `${item}/main/estrato.hbs`,
            main_Posicion: `${item}/main/posicion.hbs`,
            main_Profesion: `${item}/main/profesion.hbs`,

            item_footer: `${item}/parts/_footer.hbs`,
            item_descripcion: `${item}/parts/_description.hbs`,
            item_header: `${item}/headers/_header.hbs`,
            item_background: `${item}/headers/_background.hbs`,
            
            header_Competencia: `${item}/headers/competencia.hbs`,
            header_Sociedad: `${item}/headers/sociedad.hbs`,
            header_Pueblo: `${item}/headers/pueblo.hbs`,
            header_Reino: `${item}/headers/reino.hbs`,
            header_Estrato: `${item}/headers/estrato.hbs`,
            header_Posicion: `${item}/headers/posicion.hbs`,

            tab_Descripcion: `${item}/tabs/descripcion.hbs`,
            tab_Idiomas: `${item}/tabs/idiomas.hbs`,
            tab_Pueblos: `${item}/tabs/pueblos.hbs`,
            tab_Posiciones: `${item}/tabs/posiciones.hbs`
        })
    }
}