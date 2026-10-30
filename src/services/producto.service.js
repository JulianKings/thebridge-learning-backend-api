const Producto = require("../models/Producto");
const Proveedor = require("../models/Proveedor");

const opcionesActualizacion = { returnDocument: "after", runValidators: true };

async function listar({ tipo, page, limit } = {}) {
    const consulta = Producto.find(tipo ? { tipo } : {});
    const porPagina = Number.parseInt(limit);
    if (porPagina > 0) {
        const pagina = Math.max(Number.parseInt(page) || 1, 1);
        consulta.sort({ _id: 1 }).skip((pagina - 1) * porPagina).limit(porPagina);
    }
    return consulta;
}

async function obtenerPorId(id) {
    const producto = await Producto.findById(id);
    if (!producto) throw noEncontrado(id);
    return producto;
}

async function crear(datos) {
    await comprobarProveedor(datos.proveedor);
    return Producto.create(datos);
}

async function reemplazar(id, datos) {
    const { _id, ...resto } = datos;
    await comprobarProveedor(resto.proveedor);
    const producto = await Producto.findOneAndReplace({ _id: id }, resto, opcionesActualizacion);
    if (!producto) throw noEncontrado(id);
    return producto;
}

async function actualizar(id, datos) {
    const { _id, ...resto } = datos;
    await comprobarProveedor(resto.proveedor);
    const producto = await Producto.findByIdAndUpdate(id, resto, opcionesActualizacion);
    if (!producto) throw noEncontrado(id);
    return producto;
}

async function eliminar(id) {
    const producto = await Producto.findByIdAndDelete(id);
    if (!producto) throw noEncontrado(id);
    return producto;
}

async function comprobarProveedor(id) {
    if (id && !(await Proveedor.exists({ _id: id }))) {
        const error = new Error(`No existe el proveedor ${id}`);
        error.status = 400;
        throw error;
    }
}

function noEncontrado(id) {
    const error = new Error(`No existe el producto ${id}`);
    error.status = 404;
    return error;
}

module.exports = {listar, obtenerPorId, crear, reemplazar, actualizar, eliminar};
