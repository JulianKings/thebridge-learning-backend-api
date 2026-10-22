const mongoose = require("mongoose");

const proveedorSchema = new mongoose.Schema({
    nombreComercial: {
        type: String,
        required: [true, "El nombre comercial es obligatorio"],
        trim: true,
        unique: true
    },
    cp: {
        type: String,
        required: [true, "El código postal es obligatorio"],
        trim: true,
        match: [/^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/, "El código postal debe ser un CP español de 5 dígitos"]
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El email no es válido"]
    },
    telefono: {
        type: Number,
        required: [true, "El teléfono es obligatorio"],
        validate: {
            validator: valor => Number.isInteger(valor) && /^[6-9]\d{8}$/.test(String(valor)),
            message: "El teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9"
        }
    },
    web: {
        type: String,
        required: [true, "La web es obligatoria"],
        trim: true,
        match: [/^https?:\/\/[^\s/$.?#][^\s]*$/i, "La web debe ser una URL válida (http:// o https://)"]
    },
    tipoProducto: {
        type: [{ type: String, trim: true }],
        default: undefined,
        required: [true, "El tipo de producto es obligatorio"],
        validate: {
            validator: lista => lista.length > 0 && lista.every(tipo => tipo.length > 0),
            message: "Debe indicar al menos un tipo de producto"
        }
    },
    divisa: {
        type: String,
        required: [true, "La divisa es obligatoria"],
        trim: true,
        uppercase: true,
        enum: { values: ["EUR", "USD", "GBP", "KRW", "CNY", "JPY"], message: "La divisa debe ser EUR, USD, GBP, KRW, CNY o JPY" }
    },
    condicionesPago: {
        type: String,
        required: [true, "Las condiciones de pago son obligatorias"],
        trim: true
    },
    condicionesDevolucion: {
        type: String,
        required: [true, "Las condiciones de devolución son obligatorias"],
        trim: true
    },
    // Porcentaje de descuento por volumen
    descuentosVolumen: {
        type: Number,
        required: [true, "El descuento por volumen es obligatorio"],
        min: [0, "El descuento no puede ser negativo"],
        max: [90, "El descuento no puede superar el 90%"]
    }
});

module.exports = mongoose.model("Proveedor", proveedorSchema, "Proveedores");
