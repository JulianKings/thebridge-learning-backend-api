const mongoose = require("mongoose");
const { esFechaValida } = require("../utils/fecha");
const { passwordPlugin } = require("../utils/password");
const { GENEROS } = require("./Cliente");

const CARGOS = ["reponedor", "dependiente", "encargado"];

const empleadoSchema = new mongoose.Schema({
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
    cargo: {
        type: String,
        required: [true, "El cargo es obligatorio"],
        enum: { values: CARGOS, message: "El cargo debe ser reponedor, dependiente o encargado" }
    },
    // Fechas de alta y baja en la Seguridad Social
    altaSS: {
        type: String,
        trim: true,
        validate: { validator: esFechaValida, message: "La fecha de alta debe tener formato DD/MM/YYYY" }
    },
    bajaSS: {
        type: String,
        trim: true,
        validate: { validator: esFechaValida, message: "La fecha de baja debe tener formato DD/MM/YYYY" }
    },
    salario: {
        type: Number,
        required: [true, "El salario es obligatorio"],
        min: [0, "El salario no puede ser negativo"]
    },
    horario: {
        type: String,
        required: [true, "El horario es obligatorio"],
        trim: true
    },
    vacaciones: {
        type: Boolean,
        required: [true, "Las vacaciones son obligatorias"],
        default: false
    }
}, { timestamps: true });

empleadoSchema.plugin(passwordPlugin);

module.exports = mongoose.model("Empleado", empleadoSchema, "Empleado");
module.exports.CARGOS = CARGOS;
