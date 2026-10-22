const proveedorService = require("../services/proveedor.service");

async function listar(req, res, next) {
    try {
        const proveedores = await proveedorService.listar();
        res.json(proveedores);
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

function devolverStatus(error) {
    if (error.status) return error;
    if (error.name === "ValidationError") {
        error.status = 400;
        error.message = Object.values(error.errors).map(e => e.message).join(", ");
    } else if (error.name === "CastError") {
        error.status = 400;
        error.message = `Valor no válido para ${error.path}: ${error.value}`;
    } else if (error.code === 11000) {
        error.status = 409;
        error.message = `Ya existe un proveedor con ese ${Object.keys(error.keyValue).join(", ")}`;
    }
    return error;
}

module.exports = { listar, obtenerPorId, crear, reemplazar, actualizar, eliminar };
