const authService = require("../services/auth.service.js");

async function registro(req, res){
    const resultado = await authService.registrar(req.body);
    if (resultado){
        res.status(201).json(resultado);
    }
    else {
        res.status(409).json({error: "Email o contraseña incorrectos"});
    }
}

module.exports = {registro};