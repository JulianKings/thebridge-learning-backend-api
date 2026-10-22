const Producto = require("../models/Producto");

const opcionesActualizacion = { returnDocument: "after", runValidators: true };

async function listar() {
    return Producto.find();
}
async function obtenerPorId(id) {
    const producto = await Producto.findById(id);
    if (!producto) throw noEncontrado(id);
    return producto;
}

async function crear(datos) {
    return Producto.create(datos);
}

async function reemplazar(id, datos) {
    const { _id, ...resto } = datos;
    const producto = await Producto.findOneAndReplace({ _id: id }, resto, opcionesActualizacion);
    if (!producto) throw noEncontrado(id);
    return producto;
}

async function actualizar(id, datos) {
    const { _id, ...resto } = datos;
    const producto = await Producto.findByIdAndUpdate(id, resto, opcionesActualizacion);
    if (!producto) throw noEncontrado(id);
    return producto;
}

async function eliminar(id) {
    const producto = await Producto.findByIdAndDelete(id);
    if (!producto) throw noEncontrado(id);
    return producto;
}

function noEncontrado(id) {
    const error = new Error(`No existe el producto ${id}`);
    error.status = 404;
    return error;
}

module.exports = {listar, obtenerPorId, crear, reemplazar, actualizar, eliminar};
