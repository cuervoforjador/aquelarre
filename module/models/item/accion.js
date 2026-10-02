import {api, md_stat, md_lore, md_text} from "../_constants.js"
import extendItem_Base from "./_base.js"

export default class modelAccion extends extendItem_Base {

    /**
     * defineSchema
     * @returns 
     */
    static defineSchema() {        
        const schema = super.defineSchema();

        schema.favorita = new api.BooleanField({ initial: true })
        schema.resumen = new api.StringField({ initial: '' }) 

        schema.normal = new api.BooleanField({ initial: true })
        schema.extendida = new api.BooleanField({ initial: false })

        schema.ataque = new api.BooleanField({ initial: false })
        schema.defensa = new api.BooleanField({ initial: false })
        schema.movimiento = new api.BooleanField({ initial: false })

        schema.armas = new api.ArrayField(new api.SchemaField({
            key: new api.StringField({ initial: '' }),
            checked: new api.BooleanField({ initial: false })
        }))

        schema.formulaTirada = new api.StringField({ initial: '{skillWeapon}' })
        schema.tituloTirada = new api.StringField({ initial: '{skillWeapon}' })
        schema.formulaDano = new api.StringField({ initial: '{damageWeapon}' })
        schema.tituloDano = new api.StringField({ initial: '{damageWeapon}' })
        schema.afectaDefensa = new api.BooleanField({ initial: false })
        schema.formulaDefensa = new api.StringField({ initial: '{action}' })
        schema.tituloDefensa = new api.StringField({ initial: '{action}' })
        schema.criVScri = new api.BooleanField({ initial: false })

        return schema;
    }

}