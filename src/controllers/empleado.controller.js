const mongoose = require("mongoose");
const empleadoService = require("../services/empleado.service");


const getStatus = (req, res) => {
    res.status(200).json({ status: "ok", db: mongoose.connection.readyState === 1 ? "conectada" : "no conectada"});
};

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
