const { GENEROS } = require("../models/Cliente");
const { aFecha } = require("../utils/fecha");
const { texto, enLista, fecha, email } = require("./comun");

const MENSAJE_PASSWORD = "La contraseña debe tener al menos 8 caracteres, una letra y un número";

// Campos comunes a clientes, empleados y administradores
const persona = {
    nombre: { obligatorio: "El nombre es obligatorio", regla: texto },
    email,
    password: {
        obligatorio: "La contraseña es obligatoria",
        regla: (cadena) => cadena.isString().withMessage(MENSAJE_PASSWORD).bail()
            .isLength({ min: 8 }).withMessage(MENSAJE_PASSWORD)
            .matches(/\p{L}/u).withMessage(MENSAJE_PASSWORD)
            .matches(/\d/).withMessage(MENSAJE_PASSWORD)
            // bcrypt solo tiene en cuenta los primeros 72 bytes
            .isLength({ max: 72 }).withMessage("La contraseña no puede superar los 72 caracteres")
    },
    fechaNacimiento: {
        obligatorio: "La fecha de nacimiento es obligatoria",
        regla: (cadena) => fecha(cadena).bail()
            .custom((valor) => aFecha(valor) <= new Date()).withMessage("La fecha de nacimiento no puede ser futura")
    },
    genero: { obligatorio: "El género es obligatorio", regla: enLista(GENEROS) }
};

module.exports = persona;
