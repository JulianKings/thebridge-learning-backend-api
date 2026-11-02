const { DIVISAS } = require("../models/Proveedor");
const { texto, enLista, numero, url, email, cp, validadores } = require("./comun");

const proveedor = {
    nombreComercial: { obligatorio: "El nombre comercial es obligatorio", regla: texto },
    cp,
    email,
    telefono: {
        obligatorio: "El teléfono es obligatorio",
        regla: (cadena) => cadena.matches(/^[6-9]\d{8}$/).withMessage("El teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9")
    },
    web: { obligatorio: "La web es obligatoria", regla: url },
    tipoProducto: {
        obligatorio: "El tipo de producto es obligatorio",
        regla: (cadena) => cadena.isArray({ min: 1 }).withMessage("Debe indicar al menos un tipo de producto")
    },
    "tipoProducto.*": { regla: (cadena) => texto(cadena, "Los tipos de producto no pueden estar vacíos") },
    divisa: {
        obligatorio: "La divisa es obligatoria",
        regla: (cadena, obligatorio) => enLista(DIVISAS)(texto(cadena, obligatorio).toUpperCase())
    },
    condicionesPago: { obligatorio: "Las condiciones de pago son obligatorias", regla: texto },
    condicionesDevolucion: { obligatorio: "Las condiciones de devolución son obligatorias", regla: texto },
    descuentosVolumen: { obligatorio: "El descuento por volumen es obligatorio", regla: numero({ min: 0, max: 90 }) }
};

module.exports = validadores(proveedor);
