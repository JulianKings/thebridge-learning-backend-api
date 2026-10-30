const clienteService = require("../services/cliente.service");
const { devolverStatus } = require("../utils/errores");

async function listar(req, res, next) {
    try {
        res.json(await clienteService.listar());
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function obtenerPorId(req, res, next) {
    try {
        res.json(await clienteService.obtenerPorId(req.params.id));
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function actualizar(req, res, next) {
    try {
        res.json(await clienteService.actualizar(req.params.id, req.body));
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function eliminar(req, res, next) {
    try {
        await clienteService.eliminar(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(devolverStatus(error));
    }
}

module.exports = { listar, obtenerPorId, actualizar, eliminar };
