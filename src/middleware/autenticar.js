const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {
    const cabecera = req.headers.authorization;
    if(!cabecera || !cabecera.startsWith("Bearer")){
        return res.status(401).json({error: "falta Token"});
    }
    const token = cabecera.split(" ")[1];
    
    try{
        const datos = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = {id: datos.id, rol: datos.rol};
        next();
    } catch (error) {
        return res.status(401).json({error: "Token no válido"});
    }
}

module.exports = autenticar