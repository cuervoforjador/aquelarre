import {api, md_stat, md_healthStatus, md_lore, md_text} from "../_constants.js"
import extend_Base from "../base.js";

export default class extendCharacter_Base extends extend_Base {

    /**
     * defineSchema
     * @returns 
     */
    static defineSchema() {
        const schema = super.defineSchema()
        
        /** --- CONTROL --- */
        schema.control  = new api.SchemaField({
            textSize: new api.StringField({ initial: '1rem' }),
        })

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
            familia: md_text({label: 'common.familia', hint: 'common.familia'}),
            descripcion: md_text({label: 'common.descripcion', hint: 'common.descripcion'}),            
            limpiezaSangre: new api.NumberField({ nullable: true, initial: 0 })
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
            sue: md_stat({label: 'ATTR.sue', hint: 'ATTR.sue'}),                    //Suerte
            rr: md_stat({label: 'ATTR.rr', hint: 'ATTR.rr'}),                       //Racionalidad
            irr: md_stat({label: 'ATTR.irr', hint: 'ATTR.irr'}),                    //Irracionalidad
            ptv: md_stat({label: 'ATTR.ptv', hint: 'ATTR.ptv'}),                    //Puntos de Vida
            ptf: md_stat({label: 'ATTR.ptf', hint: 'ATTR.ptf'}),                    //Puntos de Fe
            ptc: md_stat({label: 'ATTR.ptc', hint: 'ATTR.ptc'}),                    //Puntos de Concentración
            pta: md_stat({label: 'ATTR.pta', hint: 'ATTR.pta', min: 0, max: 666}),  //Puntos de Concentración
            tem: md_stat({label: 'ATTR.tem', hint: 'ATTR.tem'}),                    //Templanza (como atributo)            
        })

        /** --- SALUD --- */
        schema.salud = new api.SchemaField({
            estado: new api.SchemaField({
                sano: md_healthStatus(0, 0.5, 1, 1, 0, 0),
                herido: md_healthStatus(0.5, 0.75, 0.5, 0.5, 0.5, 20),
                malherido: md_healthStatus(0.75, 1, 0.25, 0.25, 1, 40),
                inconsciente: md_healthStatus(1, 2, 0, 0, 1, 100),
                muerto: md_healthStatus(2, 10, 0, 0, 1, 100)
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