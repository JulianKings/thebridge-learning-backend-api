const mongoose = require("mongoose");
const productoService = require("../services/producto.service");


const getStatus = (req, res) => {
    res.status(200).json({ status: "ok", db: (mongoose.connection.readyState) ? "conectada": "no conectada"});
};

async function listar(req, res, next) {
    try {
        const productos = await productoService.listar();
        res.json(productos);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function obtenerPorId(req, res, next) {
    try {
        const producto = await productoService.obtenerPorId(req.params.id);
        res.json(producto);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function crear(req, res, next) {
    try {
        const producto = await productoService.crear(req.body);
        res.status(201).json(producto);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function reemplazar(req, res, next) {
    try {
        const producto = await productoService.reemplazar(req.params.id, req.body);
        res.json(producto);
    } catch (error) {
        next(devolerStatus(error));
    }
}

async function actualizar(req, res, next) {
    try {
        const producto = await productoService.actualizar(req.params.id, req.body);
        res.json(producto);
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function eliminar(req, res, next) {
    try {
        await productoService.eliminar(req.params.id);
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
        error.message = `Ya existe un producto con ese ${Object.keys(error.keyValue).join(", ")}`;
    }
    return error;
}

module.exports = {obtenerPorId, listar, getStatus, crear, reemplazar, actualizar, eliminar};
