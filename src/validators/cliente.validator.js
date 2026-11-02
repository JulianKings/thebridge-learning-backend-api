const persona = require("./persona");
const { texto, entero, cp, reglas, exacto, validadores } = require("./comun");

// En el registro el cliente no puede asignarse puntos
const registro = { ...persona, cp, afiliado: { regla: texto } };
const cliente = { ...registro, puntos: { regla: entero({ min: 0 }) } };

module.exports = { ...validadores(cliente), registro: exacto(reglas(registro)) };
