const Administrador = require("../models/Administrador");

const opcionesActualizacion = { returnDocument: "after", runValidators: true };

async function listar() {
    return Administrador.find();
}

async function obtenerPorId(id) {
    const administrador = await Administrador.findById(id);
    if (!administrador) throw noEncontrado(id);
    return administrador;
}

async function crear(datos) {
    return Administrador.create(datos);
}

async function reemplazar(id, datos) {
    const { _id, ...resto } = datos;
    const administrador = await Administrador.findOneAndReplace({ _id: id }, resto, opcionesActualizacion);
    if (!administrador) throw noEncontrado(id);
    return administrador;
}

async function actualizar(id, datos) {
    const { _id, ...resto } = datos;
    const administrador = await Administrador.findByIdAndUpdate(id, resto, opcionesActualizacion);
    if (!administrador) throw noEncontrado(id);
    return administrador;
}

async function eliminar(id) {
    const administrador = await Administrador.findByIdAndDelete(id);
    if (!administrador) throw noEncontrado(id);
    return administrador;
}

function noEncontrado(id) {
    const error = new Error(`No existe el administrador ${id}`);
    error.status = 404;
    return error;
}

module.exports = { listar, obtenerPorId, crear, reemplazar, actualizar, eliminar };
