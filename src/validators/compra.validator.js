const { ESTADOS } = require("../models/Compra");
const { TALLAS } = require("../models/Producto");
const { enLista, entero, idMongo, reglas, exacto, id } = require("./comun");

const compra = {
    productos: {
        obligatorio: "La compra necesita al menos un producto",
        regla: (cadena, obligatorio) => cadena.isArray({ min: 1 }).withMessage(obligatorio)
    },
    "productos.*.producto": { obligatorio: "Cada línea de la compra necesita un producto", regla: idMongo },
    "productos.*.talla": { obligatorio: "Cada línea de la compra necesita una talla", regla: enLista(TALLAS) },
    "productos.*.cantidad": { obligatorio: "Cada línea de la compra necesita una cantidad", regla: entero({ min: 1 }) }
};

const estado = { estado: { obligatorio: "Indica el nuevo estado de la compra", regla: enLista(ESTADOS) } };

module.exports = {
    crear: exacto(reglas(compra)),
    cambiarEstado: [id, ...exacto(reglas(estado))]
};
