const mongoose = require("mongoose");
const productoService = require("../services/producto.service");


const getStatus = (req, res) => {
    res.status(200).json({ status: "ok", db: (mongoose.connection.readyState) ? "conectada": "no conectada"});
};

async function listar(req, res, next) {
    try {
        const proveedores = await productoService.listar();
        res.json(proveedores);
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

module.exports = {getStatus, listar};
