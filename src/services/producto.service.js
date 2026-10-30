const Producto = require("../models/Producto");
const Proveedor = require("../models/Proveedor");
const { GRUPOS, TALLAS } = require("../models/Producto");
const { crearError } = require("../utils/errores");
const { lista, booleano, rango, ids, texto, orden, paginacion } = require("../utils/consulta");

const opcionesActualizacion = { returnDocument: "after", runValidators: true };

const PRECIO_FINAL = {
    $divide: [{ $floor: { $add: [{ $multiply: ["$precio", { $subtract: [100, { $ifNull: ["$descuento", 0] }] }] }, 0.5] } }, 100]
};

function filtroProductos(query) {
    const filtro = {};
    const grupos = lista(query.grupo);
    const desconocido = grupos.find((g) => !GRUPOS[g]);
    if (desconocido) throw crearError(400, `grupo debe ser uno de: ${Object.keys(GRUPOS).join(", ")}`);
    let tipos = lista(query.tipo);
    if (grupos.length) {
        const delGrupo = grupos.flatMap((g) => GRUPOS[g]);
        tipos = tipos.length ? tipos.filter((t) => delGrupo.includes(t)) : delGrupo;
    }
    if (tipos.length || grupos.length) filtro.tipo = { $in: tipos };

    const tallas = lista(query.talla);
    if (tallas.length) filtro.talla = { $elemMatch: { talla_tipo: { $in: tallas }, talla_stock: { $gt: 0 } } };
    const temporadas = lista(query.temporada);
    if (temporadas.length) filtro.temporada = { $in: temporadas.map((t) => texto(t, { exacto: true })) };
    const proveedores = ids(query.proveedor, "proveedor");
    if (proveedores.length) filtro.proveedor = { $in: proveedores };
    const disponible = booleano(query.disponible, "disponible");
    if (disponible !== undefined) filtro.disponible = disponible;
    if (booleano(query.oferta, "oferta")) filtro.descuento = { $gt: 0 };
    if (query.q) {
        filtro.$or = [
            { tipo: texto(String(query.q).trim().replace(/s+/g, "_")) },
            { temporada: texto(query.q) },
            { evento: texto(query.q) }
        ];
    }
    return filtro;
}

async function listar(query = {}) {
    const pipeline = [{ $match: filtroProductos(query) }, { $addFields: { precioFinal: PRECIO_FINAL } }];
    const precio = rango(query, "precio");
    if (precio) pipeline.push({ $match: { precioFinal: precio } });
    pipeline.push({ $sort: orden(query.orden, ["precio", "descuento", "createdAt", "tipo"], { alias: { precio: "precioFinal" } }) });
    const pagina = paginacion(query);
    pipeline.push({
        $facet: {
            datos: [...(pagina ? [{ $skip: pagina.skip }, { $limit: pagina.limit }] : []), { $unset: "precioFinal" }],
            total: [{ $count: "n" }]
        }
    });
    const [{ datos, total }] = await Producto.aggregate(pipeline);
    return { datos, total: total[0]?.n ?? 0 };
}

async function filtros() {
    const [tipos, tallas, temporadas, idsProveedor, [precio]] = await Promise.all([
        Producto.distinct("tipo"),
        Producto.distinct("talla.talla_tipo"),
        Producto.distinct("temporada"),
        Producto.distinct("proveedor"),
        Producto.aggregate([
            { $addFields: { precioFinal: PRECIO_FINAL } },
            { $group: { _id: null, min: { $min: "$precioFinal" }, max: { $max: "$precioFinal" } } }
        ])
    ]);
    const proveedores = await Proveedor.find({ _id: { $in: idsProveedor } }, "nombreComercial").sort({ nombreComercial: 1 });
    return {
        grupos: Object.entries(GRUPOS)
            .map(([slug, delGrupo]) => ({ slug, tipos: delGrupo.filter((t) => tipos.includes(t)) }))
            .filter((g) => g.tipos.length),
        tallas: TALLAS.filter((t) => tallas.includes(t)),
        temporadas: temporadas.filter(Boolean).sort(),
        proveedores,
        precio: { min: precio?.min ?? 0, max: precio?.max ?? 0 }
    };
}

async function obtenerPorId(id) {
    const producto = await Producto.findById(id);
    if (!producto) throw noEncontrado(id);
    return producto;
}

async function crear(datos) {
    await comprobarProveedor(datos.proveedor);
    return Producto.create(datos);
}

async function reemplazar(id, datos) {
    const { _id, ...resto } = datos;
    await comprobarProveedor(resto.proveedor);
    const producto = await Producto.findOneAndReplace({ _id: id }, resto, opcionesActualizacion);
    if (!producto) throw noEncontrado(id);
    return producto;
}

async function actualizar(id, datos) {
    const { _id, ...resto } = datos;
    await comprobarProveedor(resto.proveedor);
    const producto = await Producto.findByIdAndUpdate(id, resto, opcionesActualizacion);
    if (!producto) throw noEncontrado(id);
    return producto;
}

async function eliminar(id) {
    const producto = await Producto.findByIdAndDelete(id);
    if (!producto) throw noEncontrado(id);
    return producto;
}

async function comprobarProveedor(id) {
    if (id && !(await Proveedor.exists({ _id: id }))) {
        const error = new Error(`No existe el proveedor ${id}`);
        error.status = 400;
        throw error;
    }
}

function noEncontrado(id) {
    const error = new Error(`No existe el producto ${id}`);
    error.status = 404;
    return error;
}

module.exports = {listar, filtros, obtenerPorId, crear, reemplazar, actualizar, eliminar};
