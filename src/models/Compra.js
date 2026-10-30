const { Schema, model } = require("mongoose");
const { TALLAS } = require("./Producto");

const ESTADOS = ["pendiente", "enviado", "entregado", "cancelado"];

const lineaSchema = new Schema(
    {
        producto: { type: Schema.Types.ObjectId, ref: "Producto", required: true },
        talla: { type: String, enum: TALLAS, required: true },
        cantidad: { type: Number, required: true, min: 1 },
        precio: { type: Number, required: true, min: 0 }
    },
    { _id: false }
);

const compraSchema = new Schema(
    {
        cliente: { type: Schema.Types.ObjectId, ref: "Cliente", required: true },
        productos: {
            type: [lineaSchema],
            validate: { validator: (lineas) => lineas.length > 0, message: "La compra necesita al menos un producto" }
        },
        total: { type: Number, required: true, min: 0 },
        puntos: { type: Number, required: true, min: 0 },
        estado: {
            type: String,
            enum: { values: ESTADOS, message: "El estado debe ser pendiente, enviado, entregado o cancelado" },
            default: "pendiente"
        }
    },
    { timestamps: true }
);

module.exports = model("Compra", compraSchema, "Compra");
module.exports.ESTADOS = ESTADOS;
