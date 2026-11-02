const { validationResult } = require("express-validator");

// Responde 400 con los errores de express-validator, en el mismo formato que devolverStatus:
// "error" los resume en un texto y "errores" dice a qué campo pertenece cada uno
function validar(req, res, next) {
    const errores = validationResult(req);
    if (errores.isEmpty()) return next();
    const lista = errores.array();
    const mensajes = [...new Set(lista.map(e => e.msg))];
    const porCampo = new Map(lista.filter(e => e.path).map(e => [`${e.path}|${e.msg}`, { campo: e.path, mensaje: e.msg }]));
    res.status(400).json({ error: mensajes.join(", "), errores: [...porCampo.values()] });
}

module.exports = validar;
