const mongoose = require("mongoose");
const { crearError } = require("./errores");

const MAX_POR_PAGINA = 100;

const lista = (valor) =>
    valor === undefined ? [] : String(valor).split(",").map((v) => v.trim()).filter(Boolean);

function numero(valor, nombre) {
    if (valor === undefined || valor === "") return undefined;
    const n = Number(valor);
    if (Number.isNaN(n)) throw crearError(400, `El parámetro ${nombre} debe ser un número`);
    return n;
}

function booleano(valor, nombre) {
    if (valor === undefined || valor === "") return undefined;
    if (valor === "true" || valor === "false") return valor === "true";
    throw crearError(400, `El parámetro ${nombre} debe ser true o false`);
}

function rango(query, campo) {
    const min = numero(query[`${campo}Min`], `${campo}Min`);
    const max = numero(query[`${campo}Max`], `${campo}Max`);
    if (min === undefined && max === undefined) return undefined;
    return { ...(min !== undefined && { $gte: min }), ...(max !== undefined && { $lte: max }) };
}

function fecha(valor, nombre) {
    if (!valor) return undefined;
    const f = new Date(valor);
    if (Number.isNaN(f.getTime())) throw crearError(400, `El parámetro ${nombre} debe ser una fecha (YYYY-MM-DD)`);
    return f;
}

function ids(valor, nombre) {
    return lista(valor).map((id) => {
        if (!mongoose.isValidObjectId(id)) throw crearError(400, `Valor no válido para ${nombre}: ${id}`);
        return new mongoose.Types.ObjectId(id);
    });
}

const VARIANTES = { a: "aá", e: "eé", i: "ií", o: "oó", u: "uúü", n: "nñ" };
function texto(valor, { exacto = false } = {}) {
    const limpio = String(valor)
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/[aeioun]/gi, (c) => `[${VARIANTES[c.toLowerCase()]}]`);
    return new RegExp(exacto ? `^${limpio}$` : limpio, "i");
}

function buscarEn(q, campos) {
    if (!q) return {};
    const patron = texto(q);
    return { $or: campos.map((campo) => ({ [campo]: patron })) };
}

function orden(valor, permitidos, { porDefecto = { _id: 1 }, alias = {} } = {}) {
    if (!valor) return porDefecto;
    const campo = String(valor).replace(/^-/, "");
    if (!permitidos.includes(campo)) {
        throw crearError(400, `orden debe ser uno de: ${permitidos.join(", ")} (con - delante para descendente)`);
    }
    return { [alias[campo] ?? campo]: String(valor).startsWith("-") ? -1 : 1, _id: 1 };
}

function paginacion({ page, limit }) {
    const porPagina = Number.parseInt(limit);
    if (!(porPagina > 0)) return null;
    const pagina = Math.max(Number.parseInt(page) || 1, 1);
    const tope = Math.min(porPagina, MAX_POR_PAGINA);
    return { skip: (pagina - 1) * tope, limit: tope };
}

async function paginar(Modelo, filtro, query, { ordenar, populate } = {}) {
    const consulta = Modelo.find(filtro).sort(ordenar ?? { _id: 1 });
    const pagina = paginacion(query);
    if (pagina) consulta.skip(pagina.skip).limit(pagina.limit);
    if (populate) consulta.populate(...populate);
    const [datos, total] = await Promise.all([consulta, Modelo.countDocuments(filtro)]);
    return { datos, total };
}

function enviarLista(res, { datos, total }) {
    res.set("X-Total-Count", String(total)).json(datos);
}

module.exports = { lista, numero, booleano, rango, fecha, ids, texto, buscarEn, orden, paginacion, paginar, enviarLista };
