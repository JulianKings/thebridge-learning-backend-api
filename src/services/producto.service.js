const Producto = require("../models/Producto");

async function listar() {
    return Producto.find();
}

module.exports = {listar};
