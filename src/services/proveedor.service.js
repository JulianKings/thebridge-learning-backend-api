const producto = require("../models/producto.model");

const opcionesActualizacion = { returnDocument: "after", runValidators: true };

async function listar() {
    return producto.find();
}

async function obtenerPorId(id) {
    const producto = await producto.findById(id);
    if (!producto) throw noEncontrado(id);
    return producto;
}

async function crear(datos) {
    return producto.create(datos);
}

async function reemplazar(id, datos) {
    const { _id, ...resto } = datos;
    const producto = await producto.findOneAndReplace({ _id: id }, resto, opcionesActualizacion);
    if (!producto) throw noEncontrado(id);
    return producto;
}

async function actualizar(id, datos) {
    const { _id, ...resto } = datos;
    const producto = await producto.findByIdAndUpdate(id, resto, opcionesActualizacion);
    if (!producto) throw noEncontrado(id);
    return producto;
}

async function eliminar(id) {
    const producto = await producto.findByIdAndDelete(id);
    if (!producto) throw noEncontrado(id);
    return producto;
}

function noEncontrado(id) {
    const error = new Error(`No existe el producto ${id}`);
    error.status = 404;
    return error;
}

module.exports = { listar, obtenerPorId, crear, reemplazar, actualizar, eliminar };
