const { Schema, model } = require("mongoose");


const TIPOS = [
    "camiseta", "camisa", "polo", "sudadera", "jersey", "chaqueta", "abrigo", "chaleco",
    "pantalon", "vaqueros", "pantalon_corto", "bermudas", "leggings", "falda", "vestido",
    "mono", "traje", "blazer", "ropa_interior", "calcetines", "pijama", "bañador", "bikini",
    "ropa_deportiva", "chandal", "mallas_deportivas", "zapatillas", "zapatos", "botas",
    "sandalias", "chanclas", "gorra", "sombrero", "bufanda", "guantes", "cinturon",
    "corbata", "pajarita"
];

const TALLAS = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const GRUPOS = {
    arriba: ["camiseta", "camisa", "polo", "sudadera", "jersey", "chaqueta", "abrigo", "chaleco", "blazer"],
    abajo: ["pantalon", "vaqueros", "pantalon_corto", "bermudas", "leggings", "falda"],
    vestidos: ["vestido", "mono", "traje"],
    calzado: ["zapatillas", "zapatos", "botas", "sandalias", "chanclas"],
    accesorios: ["gorra", "sombrero", "bufanda", "guantes", "cinturon", "corbata", "pajarita"]
};
GRUPOS.mas = TIPOS.filter((tipo) => !Object.values(GRUPOS).flat().includes(tipo));

const tallaSchema = new Schema(
    {
        talla_tipo: { type: String, enum: TALLAS, required: true },
        talla_stock: { type: Number, min: 0, default: 0 }
    },
    { _id: false } // evita que cada talla genere su propio _id
);

const productoSchema = new Schema(
    {
        tipo: { type: String, enum: TIPOS, required: true },
        precio: { type: Number, required: true, min: 0 },
        disponible: { type: Boolean, default: true },
        talla: { type: [tallaSchema], default: [] },
        temporada: { type: String, trim: true, required: true },
        descuento: { type: Number, min: 0, max: 90, default: 0 },
        evento: { type: String, trim: true },
        foto: { type: String, trim: true },
        proveedor: { type: Schema.Types.ObjectId, ref: "Proveedor", required: true },
    },
    { timestamps: true }
);

module.exports = model("Producto", productoSchema, "Producto");
module.exports.TIPOS = TIPOS;
module.exports.TALLAS = TALLAS;
module.exports.GRUPOS = GRUPOS;