const Proveedor = require("../models/Proveedor");
const { lista, rango, buscarEn, orden, paginar } = require("../utils/consulta");

const opcionesActualizacion = { returnDocument: "after", runValidators: true };

function listar(query = {}) {
    const filtro = buscarEn(query.q, ["nombreComercial", "email"]);
    const divisas = lista(query.divisa).map((d) => d.toUpperCase());
    if (divisas.length) filtro.divisa = { $in: divisas };
    const tipos = lista(query.tipoProducto);
    if (tipos.length) filtro.tipoProducto = { $in: tipos };
    const descuento = rango(query, "descuentosVolumen");
    if (descuento) filtro.descuentosVolumen = descuento;
    return paginar(Proveedor, filtro, query, { ordenar: orden(query.orden, ["nombreComercial", "descuentosVolumen", "divisa"]) });
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
