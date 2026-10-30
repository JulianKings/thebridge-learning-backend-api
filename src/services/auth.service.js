const jwt = require("jsonwebtoken");
const Cliente = require("../models/Cliente");
const Administrador = require("../models/Administrador");
const Empleado = require("../models/Empleado");

function generarToken(cliente){
    return jwt.sign({ 
        id: cliente.id,
        rol: cliente.rol,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN}
    );
}

async function registrar({nombre, email, password, fechaNacimiento, genero, cp, afiliado}) {
    const administrador = await Administrador.findOne({email});
    const empleado = await Empleado.findOne({email});
    if (administrador || empleado){
        return null;
    }
    const cliente = await Cliente.create({nombre, email, password, fechaNacimiento, genero, cp, afiliado});
    return({ cliente, token: generarToken(cliente)}); 
}

module.exports = {registrar};
