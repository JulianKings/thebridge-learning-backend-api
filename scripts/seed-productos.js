require("dotenv").config();
const { conectar, desconectar } = require("../src/config/config");
const Proveedor = require("../src/models/Proveedor");
const Producto = require("../src/models/Producto");

// Requiere haber ejecutado antes "npm run seed" para que existan los proveedores.
// Cada producto guarda el _id real de un proveedor existente, así el populate("proveedor") funciona.

const PRODUCTOS_POR_PROVEEDOR = 5;

// Relaciona los tipoProducto de los proveedores con los tipos válidos del modelo Producto
const TIPOS_POR_CATEGORIA = {
    "ropa de mujer": ["vestido", "falda", "blazer", "camisa"],
    "ropa de hombre": ["camisa", "polo", "pantalon", "jersey"],
    "ropa infantil": ["camiseta", "sudadera", "pijama"],
    "ropa juvenil": ["camiseta", "sudadera", "pantalon_corto"],
    "denim": ["vaqueros"],
    "calzado": ["zapatillas", "zapatos", "botas", "sandalias"],
    "accesorios": ["gorra", "bufanda", "cinturon"],
    "complementos": ["sombrero", "guantes", "cinturon"],
    "bolsos": ["cinturon"],
    "piel": ["chaqueta", "cinturon"],
    "lencería": ["ropa_interior"],
    "ropa deportiva": ["ropa_deportiva", "chandal", "mallas_deportivas"],
    "ropa de baño": ["bañador", "bikini"],
    "pijamas": ["pijama"],
    "trajes": ["traje", "corbata", "pajarita"],
    "abrigos": ["abrigo", "chaleco"],
    "hogar": ["pijama", "calcetines"]
};

const PRECIO_BASE = {
    camiseta: 15.95, camisa: 29.95, polo: 25.95, sudadera: 35.95, jersey: 39.95, chaqueta: 69.95,
    abrigo: 119.95, chaleco: 45.95, pantalon: 39.95, vaqueros: 35.95, pantalon_corto: 22.95,
    bermudas: 25.95, leggings: 17.95, falda: 29.95, vestido: 45.95, mono: 49.95, traje: 199.95,
    blazer: 79.95, ropa_interior: 12.95, calcetines: 7.95, pijama: 29.95, "bañador": 22.95,
    bikini: 25.95, ropa_deportiva: 29.95, chandal: 49.95, mallas_deportivas: 27.95,
    zapatillas: 49.95, zapatos: 69.95, botas: 89.95, sandalias: 35.95, chanclas: 12.95,
    gorra: 15.95, sombrero: 25.95, bufanda: 19.95, guantes: 17.95, cinturon: 19.95,
    corbata: 29.95, pajarita: 19.95
};

const TEMPORADAS = ["Otoño-Invierno 2026", "Primavera-Verano 2027"];
const EVENTOS = ["Black Friday", "Rebajas de invierno", "Mid Season Sale"];

function tiposDelProveedor(proveedor) {
    const tipos = proveedor.tipoProducto.flatMap(categoria => TIPOS_POR_CATEGORIA[categoria.toLowerCase()] || []);
    return [...new Set(tipos)].filter(tipo => Producto.TIPOS.includes(tipo));
}

function generarTallas(semilla) {
    return Producto.TALLAS.slice(1, 7).map((talla, i) => ({
        talla_tipo: talla,
        talla_stock: (semilla * 7 + i * 13) % 40
    }));
}

function generarProductos(proveedor, indiceProveedor) {
    const tipos = tiposDelProveedor(proveedor);
    if (tipos.length === 0) {
        console.warn(`Proveedor ${proveedor.nombreComercial} sin tipos compatibles, se omite`);
        return [];
    }

    return Array.from({ length: PRODUCTOS_POR_PROVEEDOR }, (_, i) => {
        const semilla = indiceProveedor * PRODUCTOS_POR_PROVEEDOR + i;
        const tipo = tipos[i % tipos.length];
        const talla = generarTallas(semilla);
        const enOferta = semilla % 3 === 0;

        return {
            tipo,
            precio: Math.round((PRECIO_BASE[tipo] + (semilla % 4) * 5) * 100) / 100,
            disponible: talla.some(t => t.talla_stock > 0),
            talla,
            temporada: TEMPORADAS[semilla % TEMPORADAS.length],
            descuento: enOferta ? 10 + (semilla % 4) * 10 : 0,
            evento: enOferta ? EVENTOS[semilla % EVENTOS.length] : undefined,
            foto: `https://picsum.photos/seed/${encodeURIComponent(`${proveedor.nombreComercial}-${tipo}-${i}`)}/600/800`,
            proveedor: proveedor._id
        };
    });
}

async function sembrar() {
    await conectar();

    const proveedores = await Proveedor.find();
    if (proveedores.length === 0) {
        throw new Error("No hay proveedores en la base de datos. Ejecuta primero: npm run seed");
    }

    const productos = proveedores.flatMap(generarProductos);

    await Producto.deleteMany({});
    const insertados = await Producto.insertMany(productos);
    console.log(`Insertados ${insertados.length} productos de ${proveedores.length} proveedores en la colección ${Producto.collection.name}`);
}

sembrar()
    .catch(error => {
        console.error(error.message);
        process.exitCode = 1;
    })
    .finally(desconectar);
