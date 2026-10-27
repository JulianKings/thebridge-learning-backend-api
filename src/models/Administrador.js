const mongoose = require("mongoose");
const { esFechaValida } = require("../utils/fecha");
const { GENEROS } = require("./Cliente");

const administradorSchema = new mongoose.Schema({
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
    }
}, { timestamps: true });

module.exports = mongoose.model("Administrador", administradorSchema, "Administrador");
