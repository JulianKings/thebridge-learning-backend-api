function crearError(status, mensaje) {
    const error = new Error(mensaje);
    error.status = status;
    return error;
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
        error.message = `Ya existe un registro con ese ${Object.keys(error.keyValue).join(", ")}`;
    }
    return error;
}

module.exports = { crearError, devolverStatus };
