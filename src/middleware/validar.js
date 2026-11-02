const { validationResult } = require("express-validator");

// Responde 400 con los errores de express-validator, en el mismo formato que devolverStatus
function validar(req, res, next) {
    const errores = validationResult(req);
    if (errores.isEmpty()) return next();
    const mensajes = [...new Set(errores.array().map(e => e.msg))];
    res.status(400).json({ error: mensajes.join(", ") });
}

module.exports = validar;
