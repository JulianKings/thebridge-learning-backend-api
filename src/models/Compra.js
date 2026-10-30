const { Schema, model } = require("mongoose");
const { TALLAS } = require("./Producto");

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
        puntos: { type: Number, required: true, min: 0 }
    },
    { timestamps: true }
);

module.exports = model("Compra", compraSchema, "Compra");
