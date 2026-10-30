const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const { TIPOS, TALLAS } = require("../models/Producto");
const Proveedor = require("../models/Proveedor");
const { GENEROS } = require("../models/Cliente");
const { CARGOS } = require("../models/Empleado");

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

const personaPropiedades = {
    nombre: { type: "string", example: "Lucía Fernández" },
    email: { type: "string", format: "email", example: "lucia@correo.es" },
    fechaNacimiento: { type: "string", description: "DD/MM/YYYY", example: "14/03/1995" },
    genero: { type: "string", enum: GENEROS }
};

const conPassword = (propiedades) => ({ ...propiedades, password: { type: "string", format: "password", writeOnly: true } });

const clientePropiedades = {
    ...personaPropiedades,
    cp: { type: "string", example: "28013" },
    puntos: { type: "integer", minimum: 0, example: 120 },
    afiliado: { type: "string", example: "HILO-0001" }
};

const empleadoPropiedades = {
    ...personaPropiedades,
    cp: { type: "string", example: "28004" },
    cargo: { type: "string", enum: CARGOS },
    altaSS: { type: "string", description: "DD/MM/YYYY" },
    bajaSS: { type: "string", description: "DD/MM/YYYY" },
    salario: { type: "number", minimum: 0, example: 1350 },
    horario: { type: "string", example: "L-V 10:00-18:00" },
    vacaciones: { type: "boolean", default: false }
};

const conId = (ref) => ({ allOf: [{ type: "object", properties: { _id: { type: "string" } } }, { $ref: ref }] });

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
        { name: "Proveedores" },
        { name: "Auth" },
        { name: "Compras" },
        { name: "Clientes" },
        { name: "Empleado" },
        { name: "Administrador" }
    ],
    components: {
        securitySchemes: {
            bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
        },
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
                properties: { error: { type: "string" } }
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
            RegistroInput: {
                type: "object",
                required: ["nombre", "email", "password", "fechaNacimiento", "genero", "cp"],
                properties: conPassword({ ...personaPropiedades, cp: clientePropiedades.cp, afiliado: clientePropiedades.afiliado })
            },
            LoginInput: {
                type: "object",
                required: ["email", "password"],
                properties: { email: personaPropiedades.email, password: { type: "string", format: "password" } }
            },
            Cliente: { type: "object", properties: { _id: { type: "string" }, ...clientePropiedades } },
            ClientePatch: { type: "object", properties: conPassword(clientePropiedades) },
            EmpleadoInput: {
                type: "object",
                required: ["nombre", "email", "password", "fechaNacimiento", "genero", "cp", "cargo", "salario", "horario"],
                properties: conPassword(empleadoPropiedades)
            },
            EmpleadoPatch: { type: "object", properties: conPassword(empleadoPropiedades) },
            Empleado: conId("#/components/schemas/EmpleadoPatch"),
            AdministradorInput: {
                type: "object",
                required: ["nombre", "email", "password", "fechaNacimiento", "genero"],
                properties: conPassword(personaPropiedades)
            },
            AdministradorPatch: { type: "object", properties: conPassword(personaPropiedades) },
            Administrador: conId("#/components/schemas/AdministradorPatch"),
            CompraInput: {
                type: "object",
                required: ["productos"],
                properties: {
                    productos: {
                        type: "array",
                        minItems: 1,
                        items: {
                            type: "object",
                            required: ["producto", "talla", "cantidad"],
                            properties: {
                                producto: { type: "string", description: "_id del producto" },
                                talla: { type: "string", enum: TALLAS },
                                cantidad: { type: "integer", minimum: 1 }
                            }
                        }
                    }
                }
            },
            Compra: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    cliente: { type: "string" },
                    productos: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                producto: { type: "string" },
                                talla: { type: "string" },
                                cantidad: { type: "integer" },
                                precio: { type: "number", description: "Precio unitario con descuento en el momento de la compra" }
                            }
                        }
                    },
                    total: { type: "number" },
                    puntos: { type: "integer", description: "1 punto por euro" },
                    createdAt: { type: "string", format: "date-time" }
                }
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
            NoAutenticado: {
                description: "Falta el token o no es válido",
                content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }
            },
            SinPermiso: {
                description: "El rol del token no tiene permiso para esta acción",
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
