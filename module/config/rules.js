export const configRULES = {
    aq3: {
        estratoRoll: true,      // Tirada principal en función del estrato y después por Posición (2 Tiradas de D10)
        posicionRoll: false,    // Tirada principal directamente desde la posición (Tirada de D100)
        limpiezaSangre: false   // Aplica la Limpieza de Sangre
    },
    aq4: {
        estratoRoll: false,
        posicionRoll: true,
        limpiezaSangre: false     
    },
    vyc: {
        estratoRoll: true,
        posicionRoll: false,
        limpiezaSangre: true     
    },
}