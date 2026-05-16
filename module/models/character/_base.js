import {api, md_stat, md_lore, md_text} from "../_constants.js"
import extend_Base from "../base.js";

export default class extendCharacter_Base extends extend_Base {

    /**
     * defineSchema
     * @returns 
     */
    static defineSchema() {
        const schema = super.defineSchema()
        
        /** --- INFO --- */
        schema.info  = new api.SchemaField({
            edad: new api.NumberField({ nullable: true, initial: null }),
            altura: new api.NumberField({ nullable: true, initial: null }),
            peso: new api.NumberField({ nullable: true, initial: null }),
            reino: md_lore({label: 'common.reino', hint: 'common.reino'}),
            origen: md_lore({label: 'common.origen', hint: 'common.origen'}),
            cultura: md_lore({label: 'common.cultura', hint: 'common.cultura'}),
            estamento: md_lore({label: 'common.estamento', hint: 'common.estamento'}),
            posicion: md_lore({label: 'common.posicion', hint: 'common.posicion'}),
            profesion: md_lore({label: 'common.profesion', hint: 'common.profesion'}),
            profesionPaterna: md_lore({label: 'common.profesionPaterna', hint: 'common.profesionPaterna'}),
            descripcion: md_text({label: 'common.descripcion', hint: 'common.descripcion'})
        })

        /** --- CARACTERÍSTICAS --- */
        schema.caracteristicas = new api.SchemaField({
            fue: md_stat({label: 'CHAR.fueShort', hint: 'CHAR.fue'}),
            agi: md_stat({label: 'CHAR.agiShort', hint: 'CHAR.agi'}),
            hab: md_stat({label: 'CHAR.habShort', hint: 'CHAR.hab'}),
            res: md_stat({label: 'CHAR.resShort', hint: 'CHAR.res'}),
            per: md_stat({label: 'CHAR.perShort', hint: 'CHAR.per'}),
            tem: md_stat({label: 'CHAR.temShort', hint: 'CHAR.tem'}),
            com: md_stat({label: 'CHAR.comShort', hint: 'CHAR.com'}),
            cul: md_stat({label: 'CHAR.culShort', hint: 'CHAR.cul'}),
            asp: md_stat({label: 'CHAR.aspShort', hint: 'CHAR.asp'}),
        })  
        
        /** --- ATRIBUTOS --- */
        schema.atributos = new api.SchemaField({
            sue: md_stat({label: 'ATTR.sue', hint: 'ATTR.sue'}),
            rr: md_stat({label: 'ATTR.rr', hint: 'ATTR.rr'}),
            irr: md_stat({label: 'ATTR.irr', hint: 'ATTR.irr'}),
            ptv: md_stat({label: 'ATTR.ptv', hint: 'ATTR.ptv'}),
            ptf: md_stat({label: 'ATTR.ptf', hint: 'ATTR.ptf'}),
            ptc: md_stat({label: 'ATTR.ptc', hint: 'ATTR.ptc'}),
            tem: md_stat({label: 'ATTR.tem', hint: 'ATTR.tem'}),
        })

        /** --- SALUD --- */
        schema.salud = new api.SchemaField({
            estado: new api.SchemaField({
                sano: new api.BooleanField({ initial: false }),
                herido: new api.BooleanField({ initial: false }),
                malherido: new api.BooleanField({ initial: false }),
                inconsciente: new api.BooleanField({ initial: false }),
                muerto: new api.BooleanField({ initial: false })
            }),
            heridaGrave: new api.NumberField({ nullable: true, initial: null })
        })

        /** --- MODIFICADORES --- */
        schema.modificadores = new api.SchemaField({
            danno: new api.StringField({ initial: '' }),
            iniciativa: new api.StringField({ initial: '' }),
            sociales: new api.SchemaField({
                aspecto: new api.StringField({ initial: '' }),
                vestimenta: new api.StringField({ initial: '' }),
                profesion: new api.StringField({ initial: '' }),
                cultura: new api.StringField({ initial: '' }),
                posicion: new api.StringField({ initial: '' }),
                reputacion: new api.StringField({ initial: '' })
            })
        })

        return schema
    }

    /**
     * prepareDerivedData
     */
    prepareDerivedData() {
        super.prepareDerivedData()
    }    

}