export const configRULES = {
    aq3: {
        estratoRoll: true,      // Tirada principal en función del estrato y después por Posición (2 Tiradas de D10)
        posicionRoll: false,    // Tirada principal directamente desde la posición (Tirada de D100)
                                // Tiene que ser contraria a la anterior
        limpiezaSangre: false,  // Aplica la Limpieza de Sangre
        verCultura: false       // Muestra la cultura (LORE) en la Ficha del Personaje
    },
    aq4: {
        estratoRoll: false,
        posicionRoll: true,
        limpiezaSangre: false,
        verCultura: true    
    },
    vyc: {
        estratoRoll: true,
        posicionRoll: false,
        limpiezaSangre: true,
        verCultura: false
    },
}