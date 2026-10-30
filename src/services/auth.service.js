const jwt = require("jsonwebtoken");
const Cliente = require("../models/Cliente");
const Administrador = require("../models/Administrador");
const Empleado = require("../models/Empleado");

function obtenerRol(usuario) {
    if (usuario instanceof Administrador) return "administrador";
    if (usuario instanceof Empleado) return "empleado";
    if (usuario instanceof Cliente) return "cliente";
    throw new Error("No se puede generar un token para este tipo de usuario");
}

function generarToken(usuario){
    return jwt.sign({
        id: usuario.id,
        rol: obtenerRol(usuario),
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN}
    );
}

async function registrar({nombre, email, password, fechaNacimiento, genero, cp, afiliado}) {
    const administrador = await Administrador.findOne({email});
    const empleado = await Empleado.findOne({email});
    const clienteExistente = await Cliente.findOne({email});
    if (administrador || empleado || clienteExistente){
        return null;
    }
    const cliente = await Cliente.create({nombre, email, password, fechaNacimiento, genero, cp, afiliado});
    return({ cliente, token: generarToken(cliente)}); 
}

async function login(email, password) {

        const administrador = await Administrador.findOne({email}).select("+password");
        if (administrador){
            const coincideAdministrador = await Administrador.compararPassword(password);
            if (coincideAdministrador){
                return({administrador, token: generarToken(administrador)});
            }
        }

        const empleado = await Empleado.findOne({email}).select("+password");
        if (empleado){
            const coincideEmpleado = await Empleado.compararPassword(password);
            if (coincideEmpleado){
                return({empleado, token: generarToken(empleado)});
            }
        }

        const cliente = await Cliente.findOne({email}).select("+password");
        if (cliente){
            const coincideCliente = await cliente.compararPassword(password);
            if (coincideCliente){
                return({cliente, token: generarToken(cliente)});
            }
        }

        return null;
}

module.exports = {registrar, login};
