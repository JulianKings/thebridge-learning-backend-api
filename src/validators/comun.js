const { body, param, checkExact } = require("express-validator");
const validar = require("../middleware/validar");
const { esFechaValida } = require("../utils/fecha");

const REGEX_CP = /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/;

const msg = (texto) => (valor, { path }) => `${path} ${texto}`;
const limitesTexto = ({ min, max }) => max === undefined ? `mayor o igual que ${min}` : `entre ${min} y ${max}`;

function texto(cadena, obligatorio) {
    cadena.isString().withMessage(msg("debe ser un texto")).bail().trim();
    return obligatorio ? cadena.notEmpty().withMessage(obligatorio) : cadena;
}
const enLista = (valores) => (cadena) => cadena.isIn(valores).withMessage(msg(`debe ser uno de: ${valores.join(", ")}`));
const numero = (limites) => (cadena) => cadena.isFloat(limites).withMessage(msg(`debe ser un número ${limitesTexto(limites)}`));
const entero = (limites) => (cadena) => cadena.isInt(limites).withMessage(msg(`debe ser un número entero ${limitesTexto(limites)}`));
const booleano = (cadena) => cadena.isBoolean().withMessage(msg("debe ser true o false"));
const idMongo = (cadena) => cadena.isMongoId().withMessage((valor, { path }) => `Valor no válido para ${path}: ${valor}`);
const url = (cadena) => cadena.isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage(msg("debe ser una URL válida (http:// o https://)"));
const fecha = (cadena) => cadena.isString().withMessage(msg("debe tener formato DD/MM/YYYY")).bail()
    .trim().custom(esFechaValida).withMessage(msg("debe tener formato DD/MM/YYYY"));

const email = {
    obligatorio: "El email es obligatorio",
    regla: (cadena) => cadena.isString().withMessage("El email no es válido").bail().trim().isEmail().withMessage("El email no es válido")
};
const cp = {
    obligatorio: "El código postal es obligatorio",
    regla: (cadena) => cadena.trim().matches(REGEX_CP).withMessage("El código postal debe ser un CP español de 5 dígitos")
};

function reglas(esquema, { parcial = false } = {}) {
    return Object.entries(esquema).flatMap(([campo, { obligatorio, regla }]) => {
        
        if (campo.includes("*")) {
            const formato = regla(body(campo).optional(), obligatorio);
            return obligatorio ? [body(campo).exists({ values: "null" }).withMessage(obligatorio), formato] : [formato];
        }
        const cadena = body(campo);
        if (obligatorio && !parcial) cadena.exists({ values: "null" }).withMessage(obligatorio).bail();
        else cadena.optional();
        return [regla(cadena, obligatorio)];
    });
}

const camposNoPermitidos = (campos) => `Campos no permitidos: ${campos.map(c => c.path).join(", ")}`;

const exacto = (cadenas) => [checkExact(cadenas, { locations: ["body"], message: camposNoPermitidos }), validar];

const id = param("id").isMongoId().withMessage((valor) => `Valor no válido para id: ${valor}`);

function noVacio(req, res, next) {
    if (Object.keys(req.body ?? {}).length) return next();
    res.status(400).json({ error: "Indica al menos un campo para actualizar" });
}

function validadores(esquema) {
    return {
        crear: exacto(reglas(esquema)),
        reemplazar: [id, ...exacto(reglas(esquema))],
        actualizar: [id, ...exacto(reglas(esquema, { parcial: true })), noVacio]
    };
}

module.exports = { texto, enLista, numero, entero, booleano, idMongo, url, fecha, email, cp, reglas, exacto, id, validadores };
