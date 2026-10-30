
function autorizar(...rolesPermitidos) {
    return(req, res, next) => {
        if(!rolesPermitidos.includes(req.usuario.rol)){
            return res.status(403).json({error: "No tienes permiso pisha"});
        }
        next();
    }
}

module.exports = autorizar;