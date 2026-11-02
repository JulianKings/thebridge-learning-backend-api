function crearError(status, mensaje) {
    const error = new Error(mensaje);
    error.status = status;
    return error;
}

function devolverStatus(error) {
    if (error.status) return error;
    if (error.name === "ValidationError") {
        error.status = 400;
        error.errores = Object.values(error.errors).map(e => ({ campo: e.path, mensaje: e.message }));
        error.message = error.errores.map(e => e.mensaje).join(", ");
    } else if (error.name === "CastError") {
        error.status = 400;
        error.message = `Valor no válido para ${error.path}: ${error.value}`;
        error.errores = [{ campo: error.path, mensaje: error.message }];
    } else if (error.code === 11000) {
        error.status = 409;
        error.message = `Ya existe un registro con ese ${Object.keys(error.keyValue).join(", ")}`;
        error.errores = Object.keys(error.keyValue).map(campo => ({ campo, mensaje: `Ya existe un registro con ese ${campo}` }));
    }
    return error;
}

module.exports = { crearError, devolverStatus };
