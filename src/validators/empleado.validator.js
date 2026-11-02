const { CARGOS } = require("../models/Empleado");
const { esFechaValida, aFecha } = require("../utils/fecha");
const persona = require("./persona");
const { texto, enLista, numero, booleano, fecha, cp, validadores } = require("./comun");

// Solo se puede comparar si el alta llega en la misma petición
const noAnteriorAlAlta = (baja, { req }) => !esFechaValida(req.body.altaSS) || aFecha(baja) >= aFecha(req.body.altaSS);

const empleado = {
    ...persona,
    cp,
    cargo: { obligatorio: "El cargo es obligatorio", regla: enLista(CARGOS) },
    altaSS: { regla: fecha },
    bajaSS: {
        regla: (cadena) => fecha(cadena).bail()
            .custom(noAnteriorAlAlta).withMessage("La fecha de baja no puede ser anterior a la de alta")
    },
    salario: { obligatorio: "El salario es obligatorio", regla: numero({ min: 0 }) },
    horario: { obligatorio: "El horario es obligatorio", regla: texto },
    vacaciones: { regla: booleano }
};

module.exports = validadores(empleado);
