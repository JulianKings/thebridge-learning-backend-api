const mongoose = require("mongoose");
const Compra = require("../models/Compra");
const Producto = require("../models/Producto");
const Cliente = require("../models/Cliente");
const { crearError } = require("../utils/errores");
const { lista, rango, fecha, ids, orden, paginar } = require("../utils/consulta");
const { ESTADOS } = Compra;

const CLIENTE = ["cliente", "nombre email"];
const noEncontrada = (id) => crearError(404, `No existe la compra ${id}`);

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
        const precio = Math.round(encontrado.precio * (100 - (encontrado.descuento ?? 0))) / 100;
        validadas.push({ producto: encontrado._id, talla, cantidad, precio });
    }
    return validadas;
}

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

function filtroCompras(query) {
    const filtro = {};
    const clientes = ids(query.cliente, "cliente");
    if (clientes.length) filtro.cliente = { $in: clientes };
    const estados = lista(query.estado);
    const desconocido = estados.find((e) => !ESTADOS.includes(e));
    if (desconocido) throw crearError(400, `estado debe ser uno de: ${ESTADOS.join(", ")}`);
    if (estados.length) filtro.estado = { $in: estados.includes("pendiente") ? [...estados, null] : estados };
    const desde = fecha(query.desde, "desde");
    const hasta = fecha(query.hasta, "hasta");
    if (hasta) hasta.setUTCDate(hasta.getUTCDate() + 1);
    if (desde || hasta) filtro.createdAt = { ...(desde && { $gte: desde }), ...(hasta && { $lt: hasta }) };
    const total = rango(query, "total");
    if (total) filtro.total = total;
    return filtro;
}

const ordenCompras = (query) => orden(query.orden, ["createdAt", "total", "puntos"], { porDefecto: { createdAt: -1, _id: 1 } });

function delCliente(clienteId, query = {}) {
    const filtro = { ...filtroCompras({ ...query, cliente: undefined }), cliente: clienteId };
    return paginar(Compra, filtro, query, { ordenar: ordenCompras(query) });
}

function listar(query = {}) {
    return paginar(Compra, filtroCompras(query), query, { ordenar: ordenCompras(query), populate: CLIENTE });
}

async function obtenerPorId(id, usuario) {
    const filtro = usuario.rol === "cliente" ? { _id: id, cliente: usuario.id } : { _id: id };
    const compra = await Compra.findOne(filtro).populate(...CLIENTE);
    if (!compra) throw noEncontrada(id);
    return compra;
}

async function anular(compra) {
    await devolverStock(compra.productos);
    await Cliente.updateOne({ _id: compra.cliente }, [
        { $set: { puntos: { $max: [0, { $subtract: [{ $ifNull: ["$puntos", 0] }, compra.puntos] }] } } }
    ], { updatePipeline: true });
}

async function cambiarEstado(id, estado) {
    if (!estado) throw crearError(400, "Indica el nuevo estado de la compra");
    if (!ESTADOS.includes(estado)) throw crearError(400, `estado debe ser uno de: ${ESTADOS.join(", ")}`);
    const anterior = await Compra.findOneAndUpdate({ _id: id, estado: { $ne: "cancelado" } }, { estado }, { runValidators: true });
    if (!anterior) {
        if (await Compra.exists({ _id: id })) throw crearError(409, "La compra está cancelada y ya no se puede modificar");
        throw noEncontrada(id);
    }
    if (estado === "cancelado") await anular(anterior);
    return Compra.findById(id).populate(...CLIENTE);
}

async function eliminar(id) {
    const compra = await Compra.findByIdAndDelete(id);
    if (!compra) throw noEncontrada(id);
    if (compra.estado !== "cancelado") await anular(compra);
    return compra;
}

module.exports = { crear, delCliente, listar, obtenerPorId, cambiarEstado, eliminar };
