const { TIPOS, TALLAS } = require("../models/Producto");
const { texto, enLista, numero, entero, booleano, idMongo, url, validadores } = require("./comun");

const sinTallasRepetidas = (tallas) => new Set(tallas.map(t => t?.talla_tipo)).size === tallas.length;

const producto = {
    tipo: { obligatorio: "El tipo es obligatorio", regla: enLista(TIPOS) },
    precio: { obligatorio: "El precio es obligatorio", regla: numero({ min: 0 }) },
    disponible: { regla: booleano },
    talla: {
        regla: (cadena) => cadena.isArray().withMessage("talla debe ser una lista").bail()
            .custom(sinTallasRepetidas).withMessage("No se puede repetir una talla en el mismo producto")
    },
    "talla.*.talla_tipo": { obligatorio: "Cada talla necesita talla_tipo", regla: enLista(TALLAS) },
    "talla.*.talla_stock": { regla: entero({ min: 0 }) },
    temporada: { obligatorio: "La temporada es obligatoria", regla: texto },
    descuento: { regla: numero({ min: 0, max: 90 }) },
    evento: { regla: texto },
    foto: { regla: url },
    proveedor: { obligatorio: "El proveedor es obligatorio", regla: idMongo }
};

module.exports = validadores(producto);
