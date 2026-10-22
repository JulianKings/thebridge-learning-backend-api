const Proveedor = require("../models/proveedor.model");

const opcionesActualizacion = { returnDocument: "after", runValidators: true };

async function listar() {
    return Proveedor.find();
}

async function obtenerPorId(id) {
    const proveedor = await Proveedor.findById(id);
    if (!proveedor) throw noEncontrado(id);
    return proveedor;
}

async function crear(datos) {
    return Proveedor.create(datos);
}

async function reemplazar(id, datos) {
    const { _id, ...resto } = datos;
    const proveedor = await Proveedor.findOneAndReplace({ _id: id }, resto, opcionesActualizacion);
    if (!proveedor) throw noEncontrado(id);
    return proveedor;
}

async function actualizar(id, datos) {
    const { _id, ...resto } = datos;
    const proveedor = await Proveedor.findByIdAndUpdate(id, resto, opcionesActualizacion);
    if (!proveedor) throw noEncontrado(id);
    return proveedor;
}

async function eliminar(id) {
    const proveedor = await Proveedor.findByIdAndDelete(id);
    if (!proveedor) throw noEncontrado(id);
    return proveedor;
}

function noEncontrado(id) {
    const error = new Error(`No existe el proveedor ${id}`);
    error.status = 404;
    return error;
}

module.exports = { listar, obtenerPorId, crear, reemplazar, actualizar, eliminar };
