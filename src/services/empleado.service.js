const Empleado = require("../models/Empleado");
const { lista, booleano, rango, buscarEn, orden, paginar } = require("../utils/consulta");

const opcionesActualizacion = { returnDocument: "after", runValidators: true };

function listar(query = {}) {
    const filtro = buscarEn(query.q, ["nombre", "email"]);
    const generos = lista(query.genero);
    if (generos.length) filtro.genero = { $in: generos };
    const cargos = lista(query.cargo);
    if (cargos.length) filtro.cargo = { $in: cargos };
    const vacaciones = booleano(query.vacaciones, "vacaciones");
    if (vacaciones !== undefined) filtro.vacaciones = vacaciones;
    const salario = rango(query, "salario");
    if (salario) filtro.salario = salario;
    return paginar(Empleado, filtro, query, { ordenar: orden(query.orden, ["nombre", "email", "cargo", "salario", "createdAt"]) });
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
