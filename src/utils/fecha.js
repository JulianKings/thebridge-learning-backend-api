// Comprueba que la fecha tenga formato DD/MM/YYYY y que exista (p. ej. rechaza 31/02/2000)
function esFechaValida(valor) {
    const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
    if (!partes) return false;
    const [, dia, mes, anio] = partes.map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    return fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
}

module.exports = { esFechaValida };
