const Cliente = require("../models/Cliente");
const { crearError } = require("../utils/errores");
const { lista, rango, buscarEn, orden, paginar } = require("../utils/consulta");

const opcionesActualizacion = { returnDocument: "after", runValidators: true };

const noEncontrado = (id) => crearError(404, `No existe el cliente ${id}`);

function listar(query = {}) {
    const filtro = buscarEn(query.q, ["nombre", "email"]);
    const generos = lista(query.genero);
    if (generos.length) filtro.genero = { $in: generos };
    const puntos = rango(query, "puntos");
    if (puntos) filtro.puntos = puntos;
    return paginar(Cliente, filtro, query, { ordenar: orden(query.orden, ["nombre", "email", "puntos", "createdAt"]) });
}

async function obtenerPorId(id) {
    const cliente = await Cliente.findById(id);
    if (!cliente) throw noEncontrado(id);
    return cliente;
}

function crear(datos) {
    return Cliente.create(datos);
}

async function reemplazar(id, datos) {
    const { _id, ...resto } = datos;
    const cliente = await Cliente.findOneAndReplace({ _id: id }, resto, opcionesActualizacion);
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

module.exports = { listar, obtenerPorId, crear, reemplazar, actualizar, eliminar };
