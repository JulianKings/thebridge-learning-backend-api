const compraService = require("../services/compra.service");
const { devolverStatus } = require("../utils/errores");
const { enviarLista } = require("../utils/consulta");

async function crear(req, res, next) {
    try {
        const compra = await compraService.crear(req.usuario.id, req.body.productos);
        res.status(201).json(compra);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function mias(req, res, next) {
    try {
        enviarLista(res, await compraService.delCliente(req.usuario.id, req.query));
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function listar(req, res, next) {
    try {
        enviarLista(res, await compraService.listar(req.query));
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function obtenerPorId(req, res, next) {
    try {
        res.json(await compraService.obtenerPorId(req.params.id, req.usuario));
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function cambiarEstado(req, res, next) {
    try {
        res.json(await compraService.cambiarEstado(req.params.id, req.body?.estado));
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function eliminar(req, res, next) {
    try {
        await compraService.eliminar(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(devolverStatus(error));
    }
}

module.exports = { crear, mias, listar, obtenerPorId, cambiarEstado, eliminar };
