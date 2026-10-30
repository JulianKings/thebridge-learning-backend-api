const proveedorService = require("../services/proveedor.service");
const { devolverStatus } = require("../utils/errores");
const { enviarLista } = require("../utils/consulta");

async function listar(req, res, next) {
    try {
        enviarLista(res, await proveedorService.listar(req.query));
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function obtenerPorId(req, res, next) {
    try {
        const proveedor = await proveedorService.obtenerPorId(req.params.id);
        res.json(proveedor);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function crear(req, res, next) {
    try {
        const proveedor = await proveedorService.crear(req.body);
        res.status(201).json(proveedor);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function reemplazar(req, res, next) {
    try {
        const proveedor = await proveedorService.reemplazar(req.params.id, req.body);
        res.json(proveedor);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function actualizar(req, res, next) {
    try {
        const proveedor = await proveedorService.actualizar(req.params.id, req.body);
        res.json(proveedor);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function eliminar(req, res, next) {
    try {
        await proveedorService.eliminar(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(devolverStatus(error));
    }
}

module.exports = { listar, obtenerPorId, crear, reemplazar, actualizar, eliminar };
