const empleadoService = require("../services/empleado.service");
const { devolverStatus } = require("../utils/errores");

async function listar(req, res, next) {
    try {
        const empleados = await empleadoService.listar();
        res.json(empleados);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function obtenerPorId(req, res, next) {
    try {
        const empleado = await empleadoService.obtenerPorId(req.params.id);
        res.json(empleado);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function crear(req, res, next) {
    try {
        const empleado = await empleadoService.crear(req.body);
        res.status(201).json(empleado);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function reemplazar(req, res, next) {
    try {
        const empleado = await empleadoService.reemplazar(req.params.id, req.body);
        res.json(empleado);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function actualizar(req, res, next) {
    try {
        const empleado = await empleadoService.actualizar(req.params.id, req.body);
        res.json(empleado);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function eliminar(req, res, next) {
    try {
        await empleadoService.eliminar(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(devolverStatus(error));
    }
}

module.exports = {obtenerPorId, listar, crear, reemplazar, actualizar, eliminar};
