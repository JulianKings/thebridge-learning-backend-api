const mongoose = require("mongoose");
const Compra = require("../models/Compra");
const Producto = require("../models/Producto");
const Cliente = require("../models/Cliente");
const { crearError } = require("../utils/errores");

const redondear = (n) => Math.round(n * 100) / 100;

async function validarLineas(lineas) {
    if (!Array.isArray(lineas) || lineas.length === 0) throw crearError(400, "La compra necesita al menos un producto");
    const validadas = [];
    for (const { producto, talla, cantidad } of lineas) {
        if (!mongoose.isValidObjectId(producto)) throw crearError(400, `Valor no válido para producto: ${producto}`);
        if (!Number.isInteger(cantidad) || cantidad < 1) throw crearError(400, "La cantidad debe ser un número entero mayor que 0");
        const encontrado = await Producto.findById(producto);
        if (!encontrado) throw crearError(404, `No existe el producto ${producto}`);
        if (!encontrado.disponible) throw crearError(409, `El producto ${producto} no está disponible`);
        if (!encontrado.talla.some((t) => t.talla_tipo === talla)) throw crearError(400, `El producto ${producto} no tiene la talla ${talla}`);
        const precio = redondear(encontrado.precio * (1 - (encontrado.descuento ?? 0) / 100));
        validadas.push({ producto: encontrado._id, talla, cantidad, precio });
    }
    return validadas;
}

// Each line is decremented with a conditional, atomic update (only if that size still has
// enough stock), so two simultaneous purchases can't oversell. If any step fails, the lines
// already taken are given back before the error is rethrown.
async function descontarStock(lineas) {
    const descontadas = [];
    try {
        for (const linea of lineas) {
            const actualizado = await Producto.findOneAndUpdate(
                { _id: linea.producto, talla: { $elemMatch: { talla_tipo: linea.talla, talla_stock: { $gte: linea.cantidad } } } },
                { $inc: { "talla.$.talla_stock": -linea.cantidad } }
            );
            if (!actualizado) throw crearError(409, `No hay stock suficiente de la talla ${linea.talla}`);
            descontadas.push(linea);
        }
    } catch (error) {
        await devolverStock(descontadas);
        throw error;
    }
}

function devolverStock(lineas) {
    return Promise.all(
        lineas.map((l) =>
            Producto.updateOne({ _id: l.producto, "talla.talla_tipo": l.talla }, { $inc: { "talla.$.talla_stock": l.cantidad } })
        )
    );
}

async function crear(clienteId, lineas) {
    const productos = await validarLineas(lineas);
    await descontarStock(productos);
    try {
        const total = redondear(productos.reduce((suma, l) => suma + l.precio * l.cantidad, 0));
        const puntos = Math.floor(total);
        const compra = await Compra.create({ cliente: clienteId, productos, total, puntos });
        await Cliente.findByIdAndUpdate(clienteId, { $inc: { puntos } });
        return compra;
    } catch (error) {
        await devolverStock(productos);
        throw error;
    }
}

function delCliente(clienteId) {
    return Compra.find({ cliente: clienteId }).sort({ createdAt: -1 });
}

function listar() {
    return Compra.find().sort({ createdAt: -1 }).populate("cliente", "nombre email");
}

module.exports = { crear, delCliente, listar };
