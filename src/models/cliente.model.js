const mongoose = require("mongoose");
const { esFechaValida } = require("../utils/fecha");

const GENEROS = ["Hombre", "Mujer"];

const clienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El email no es válido"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    },
    fechaNacimiento: {
        type: String,
        required: [true, "La fecha de nacimiento es obligatoria"],
        trim: true,
        validate: { validator: esFechaValida, message: "La fecha de nacimiento debe tener formato DD/MM/YYYY" }
    },
    genero: {
        type: String,
        required: [true, "El género es obligatorio"],
        enum: { values: GENEROS, message: "El género debe ser Hombre o Mujer" }
    },
    cp: {
        type: String,
        required: [true, "El código postal es obligatorio"],
        trim: true,
        match: [/^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/, "El código postal debe ser un CP español de 5 dígitos"]
    },
    puntos: {
        type: Number,
        default: 0,
        min: [0, "Los puntos no pueden ser negativos"]
    },
    afiliado: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Cliente", clienteSchema, "Cliente");
module.exports.GENEROS = GENEROS;
