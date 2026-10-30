const Empleado = require("../models/Empleado");

const opcionesActualizacion = { returnDocument: "after", runValidators: true };

async function listar() {
    return Empleado.find();
}

async function obtenerPorId(id) {
    const empleado = await Empleado.findById(id);
    if (!empleado) throw noEncontrado(id);
    return empleado;
}

async function crear(datos) {
    return Empleado.create(datos);
}

async function reemplazar(id, datos) {
    const { _id, ...resto } = datos;
    const empleado = await Empleado.findOneAndReplace({ _id: id }, resto, opcionesActualizacion);
    if (!empleado) throw noEncontrado(id);
    return empleado;
}

async function actualizar(id, datos) {
    const { _id, ...resto } = datos;
    const empleado = await Empleado.findByIdAndUpdate(id, resto, opcionesActualizacion);
    if (!empleado) throw noEncontrado(id);
    return empleado;
}

async function eliminar(id) {
    const empleado = await Empleado.findByIdAndDelete(id);
    if (!empleado) throw noEncontrado(id);
    return empleado;
}

function noEncontrado(id) {
    const error = new Error(`No existe el empleado ${id}`);
    error.status = 404;
    return error;
}

module.exports = { listar, obtenerPorId, crear, reemplazar, actualizar, eliminar };
