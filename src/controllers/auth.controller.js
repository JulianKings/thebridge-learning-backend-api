const authService = require("../services/auth.service.js");
const { devolverStatus } = require("../utils/errores");

async function registro(req, res, next) {
    try {
        const resultado = await authService.registrar(req.body);
        if (!resultado) {
            return res.status(409).json({ error: "Ya existe una cuenta con ese email" });
        }
        res.status(201).json(resultado);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email o password OBLIGATORIO" });
        }
        const resultado = await authService.login(email, password);
        if (!resultado) {
            return res.status(401).json({ error: "Email o contraseñas incorrectos" });
        }
        res.json(resultado);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function perfil(req, res, next) {
    try {
        res.json(await authService.perfil(req.usuario));
    } catch (error) {
        next(devolverStatus(error));
    }
}

module.exports = { registro, login, perfil };
