const compraService = require("../services/compra.service");
const { devolverStatus } = require("../utils/errores");

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
        res.json(await compraService.delCliente(req.usuario.id));
    } catch (error) {
        next(devolverStatus(error));
    }
}

async function listar(req, res, next) {
    try {
        res.json(await compraService.listar());
    } catch (error) {
        next(devolverStatus(error));
    }
}

module.exports = { crear, mias, listar };
