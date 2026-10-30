const administradorService = require("../services/administrador.service");
const { devolverStatus } = require("../utils/errores");

async function listar(req, res, next) {
    try {
        const administradores = await administradorService.listar();
        res.json(administradores);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function obtenerPorId(req, res, next) {
    try {
        const administrador = await administradorService.obtenerPorId(req.params.id);
        res.json(administrador);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function crear(req, res, next) {
    try {
        const administrador = await administradorService.crear(req.body);
        res.status(201).json(administrador);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function reemplazar(req, res, next) {
    try {
        const administrador = await administradorService.reemplazar(req.params.id, req.body);
        res.json(administrador);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function actualizar(req, res, next) {
    try {
        const administrador = await administradorService.actualizar(req.params.id, req.body);
        res.json(administrador);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function eliminar(req, res, next) {
    try {
        await administradorService.eliminar(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(devolverStatus(error));
    }
}

module.exports = {obtenerPorId, listar, crear, reemplazar, actualizar, eliminar};
