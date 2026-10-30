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

async function login(req, res) {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({error: "Email o password OBLIGATORIO"});
    }
    const resultado = await authService.login(email, password);
    if(!resultado){
        return res.status(401).json({error: "Email o contraseñas incorrectos"});
    }
    res.json(resultado);
}

module.exports = {registro, login};