const Cliente = require("../models/Cliente");
const { crearError } = require("../utils/errores");

const opcionesActualizacion = { returnDocument: "after", runValidators: true };

const noEncontrado = (id) => crearError(404, `No existe el cliente ${id}`);

function listar() {
    return Cliente.find();
}

async function obtenerPorId(id) {
    const cliente = await Cliente.findById(id);
    if (!cliente) throw noEncontrado(id);
    return cliente;
}

async function actualizar(id, datos) {
    const { _id, ...resto } = datos;
    const cliente = await Cliente.findByIdAndUpdate(id, resto, opcionesActualizacion);
    if (!cliente) throw noEncontrado(id);
    return cliente;
}

async function eliminar(id) {
    const cliente = await Cliente.findByIdAndDelete(id);
    if (!cliente) throw noEncontrado(id);
    return cliente;
}

module.exports = { listar, obtenerPorId, actualizar, eliminar };
