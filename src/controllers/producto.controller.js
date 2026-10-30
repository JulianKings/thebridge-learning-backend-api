const mongoose = require("mongoose");
const { devolverStatus } = require("../utils/errores");
const { enviarLista } = require("../utils/consulta");
const productoService = require("../services/producto.service");

const getStatus = (req, res) => {
    res.status(200).json({ status: "ok", db: mongoose.connection.readyState === 1 ? "conectada" : "no conectada"});
};

async function listar(req, res, next) {
    try {
        enviarLista(res, await productoService.listar(req.query));
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function filtros(req, res, next) {
    try {
        res.json(await productoService.filtros());
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
        next(devolverStatus(error));
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

module.exports = {obtenerPorId, listar, filtros, getStatus, crear, reemplazar, actualizar, eliminar};
