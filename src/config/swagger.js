const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const { TIPOS, TALLAS } = require("../models/Producto");
const Proveedor = require("../models/Proveedor");

const DIVISAS = Proveedor.schema.path("divisa").enumValues;

// Propiedades compartidas por el body de POST/PUT (con required) y el de PATCH (sin required)
const productoPropiedades = {
    tipo: { type: "string", enum: TIPOS, example: "camiseta" },
    precio: { type: "number", minimum: 0, example: 19.99 },
    disponible: { type: "boolean", default: true },
    talla: { type: "array", items: { $ref: "#/components/schemas/Talla" } },
    temporada: { type: "string", example: "verano 2026" },
    descuento: { type: "number", minimum: 0, maximum: 90, default: 0 },
    evento: { type: "string", example: "rebajas" },
    foto: { type: "string", example: "https://ejemplo.com/camiseta.jpg" },
    proveedor: { type: "string", description: "_id de un proveedor existente", example: "665f1c2b9a1e4b0012345678" }
};

const proveedorPropiedades = {
    nombreComercial: { type: "string", example: "Textiles García" },
    cp: { type: "string", pattern: "^(0[1-9]|[1-4]\\d|5[0-2])\\d{3}$", example: "28001" },
    email: { type: "string", format: "email", example: "contacto@textilesgarcia.es" },
    telefono: { type: "integer", description: "9 dígitos, empieza por 6, 7, 8 o 9", example: 912345678 },
    web: { type: "string", format: "uri", example: "https://textilesgarcia.es" },
    tipoProducto: { type: "array", minItems: 1, items: { type: "string" }, example: ["camiseta", "pantalon"] },
    divisa: { type: "string", enum: DIVISAS, example: "EUR" },
    condicionesPago: { type: "string", example: "30 días" },
    condicionesDevolucion: { type: "string", example: "15 días desde la recepción" },
    descuentosVolumen: { type: "number", minimum: 0, maximum: 90, description: "Porcentaje", example: 10 }
};

const definicion = {
    openapi: "3.0.3",
    info: {
        title: "TheBridge Tienda de Ropa API",
        version: "0.1.0",
        description: "API de una tienda de ropa"
    },
    servers: [{ url: "/" }],
    tags: [
        { name: "Estado" },
        { name: "Productos" },
        { name: "Proveedores" }
    ],
    components: {
        parameters: {
            Id: {
                name: "id",
                in: "path",
                required: true,
                description: "ObjectId de MongoDB",
                schema: { type: "string", example: "665f1c2b9a1e4b0012345678" }
            }
        },
        schemas: {
            Error: {
                type: "object",
                properties: { message: { type: "string" } }
            },
            Talla: {
                type: "object",
                required: ["talla_tipo"],
                properties: {
                    talla_tipo: { type: "string", enum: TALLAS },
                    talla_stock: { type: "integer", minimum: 0, default: 0 }
                }
            },
            ProductoInput: {
                type: "object",
                required: ["tipo", "precio", "temporada", "proveedor"],
                properties: productoPropiedades
            },
            ProductoPatch: {
                type: "object",
                properties: productoPropiedades
            },
            Producto: {
                allOf: [
                    { type: "object", properties: { _id: { type: "string" } } },
                    { $ref: "#/components/schemas/ProductoInput" },
                    {
                        type: "object",
                        properties: {
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" }
                        }
                    }
                ]
            },
            ProveedorInput: {
                type: "object",
                required: Object.keys(proveedorPropiedades),
                properties: proveedorPropiedades
            },
            ProveedorPatch: {
                type: "object",
                properties: proveedorPropiedades
            },
            Proveedor: {
                allOf: [
                    { type: "object", properties: { _id: { type: "string" } } },
                    { $ref: "#/components/schemas/ProveedorInput" }
                ]
            }
        },
        responses: {
            ErrorValidacion: {
                description: "Datos o id no válidos",
                content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }
            },
            NoEncontrado: {
                description: "No existe ningún documento con ese id",
                content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }
            },
            Duplicado: {
                description: "Ya existe un documento con ese valor único",
                content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }
            }
        }
    }
};

module.exports = swaggerJsdoc({
    definition: definicion,
    apis: [path.join(__dirname, "../routes/*.js").replace(/\\/g, "/")]
});
