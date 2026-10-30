const mongoose = require("mongoose");
const { devolverStatus } = require("../utils/errores");
const productoService = require("../services/producto.service");

const getStatus = (req, res) => {
    res.status(200).json({ status: "ok", db: mongoose.connection.readyState === 1 ? "conectada" : "no conectada"});
};

async function listar(req, res, next) {
    try {
        const productos = await productoService.listar(req.query);
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

module.exports = {obtenerPorId, listar, getStatus, crear, reemplazar, actualizar, eliminar};
