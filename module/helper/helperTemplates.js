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

            // --- CHARACTER ---
            main_Actor: `${character}/main/character.hbs`,

            character_background: `${character}/headers/_background.hbs`,            
            header_Character: `${character}/headers/character.hbs`,
            header_Lore: `${character}/headers/lore.hbs`,

            tab_Stats: `${character}/tabs/stats.hbs`,
            tab_Combate: `${character}/tabs/combate.hbs`,

            stats_main_aq3: `${character}/parts/aq3/stats_main.hbs`,
            stats_chars_aq3: `${character}/parts/aq3/stats_chars.hbs`,
            stats_extra_aq3: `${character}/parts/aq3/stats_extra.hbs`,
            stats_health_aq3: `${character}/parts/aq3/stats_health.hbs`,
            stats_rrirr_aq3: `${character}/parts/aq3/stats_rrirr.hbs`,
            stats_exper_aq3: `${character}/parts/aq3/stats_exper.hbs`,
            stats_skills_aq3: `${character}/parts/aq3/stats_skills.hbs`,

            stats_main_aq4: `${character}/parts/aq4/stats_main.hbs`,
            stats_chars_aq4: `${character}/parts/aq4/stats_chars.hbs`,
            stats_percents_aq4: `${character}/parts/aq4/stats_percents.hbs`,
            stats_extra_aq4: `${character}/parts/aq4/stats_extra.hbs`,
            stats_health_aq4: `${character}/parts/aq4/stats_health.hbs`,
            stats_rrirr_aq4: `${character}/parts/aq4/stats_rrirr.hbs`,
            stats_exper_aq4: `${character}/parts/aq4/stats_exper.hbs`,
            stats_skills_aq4: `${character}/parts/aq4/stats_skills.hbs`,

            stats_main_vyc: `${character}/parts/vyc/stats_main.hbs`,
            stats_chars_vyc: `${character}/parts/vyc/stats_chars.hbs`,
            stats_extra_vyc: `${character}/parts/vyc/stats_extra.hbs`,
            stats_health_vyc: `${character}/parts/vyc/stats_health.hbs`,
            stats_rrirr_vyc: `${character}/parts/vyc/stats_rrirr.hbs`,
            stats_exper_vyc: `${character}/parts/vyc/stats_exper.hbs`,
            stats_skills_vyc: `${character}/parts/vyc/stats_skills.hbs`,

            // --- ITEMS ---
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
            tab_Estratos: `${item}/tabs/estratos.hbs`,
            tab_Posiciones: `${item}/tabs/posiciones.hbs`
        })
    }
}