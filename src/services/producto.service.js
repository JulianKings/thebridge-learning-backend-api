const Producto = require("../models/Producto");

async function listar() {
    return Proveedor.find();
}

module.exports = {listar};
