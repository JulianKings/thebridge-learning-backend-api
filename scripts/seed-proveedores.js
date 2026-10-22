require("dotenv").config();
const { conectar, desconectar } = require("../src/config/config");
const Proveedor = require("../src/models/proveedor.model");

// Webs y códigos postales de sede reales. Emails, teléfonos, condiciones y descuentos son ficticios (datos de demo).
const proveedores = [
    {
        nombreComercial: "Zara",
        cp: "15143",
        email: "proveedores@zara.example",
        telefono: 981000001,
        web: "https://www.zara.com",
        tipoProducto: ["Ropa de mujer", "Ropa de hombre", "Ropa infantil", "Calzado", "Accesorios"],
        divisa: "EUR",
        condicionesPago: "Transferencia bancaria a 60 días fecha factura",
        condicionesDevolucion: "Devolución de mercancía defectuosa en 30 días",
        descuentosVolumen: 12
    },
    {
        nombreComercial: "Pull&Bear",
        cp: "15570",
        email: "proveedores@pullandbear.example",
        telefono: 981000002,
        web: "https://www.pullandbear.com",
        tipoProducto: ["Ropa juvenil", "Denim", "Calzado", "Accesorios"],
        divisa: "EUR",
        condicionesPago: "Transferencia bancaria a 30 días fecha factura",
        condicionesDevolucion: "Devolución en 30 días con el embalaje original",
        descuentosVolumen: 10
    },
    {
        nombreComercial: "Bershka",
        cp: "08490",
        email: "proveedores@bershka.example",
        telefono: 937000003,
        web: "https://www.bershka.com",
        tipoProducto: ["Ropa juvenil", "Denim", "Calzado", "Accesorios"],
        divisa: "EUR",
        condicionesPago: "Transferencia bancaria a 45 días fecha factura",
        condicionesDevolucion: "Devolución en 30 días",
        descuentosVolumen: 10
    },
    {
        nombreComercial: "Massimo Dutti",
        cp: "08490",
        email: "proveedores@massimodutti.example",
        telefono: 937000004,
        web: "https://www.massimodutti.com",
        tipoProducto: ["Ropa de mujer", "Ropa de hombre", "Piel", "Calzado"],
        divisa: "EUR",
        condicionesPago: "Transferencia bancaria a 60 días fecha factura",
        condicionesDevolucion: "Devolución de mercancía defectuosa en 15 días",
        descuentosVolumen: 8
    },
    {
        nombreComercial: "Stradivarius",
        cp: "08650",
        email: "proveedores@stradivarius.example",
        telefono: 938000005,
        web: "https://www.stradivarius.com",
        tipoProducto: ["Ropa de mujer", "Calzado", "Bolsos", "Accesorios"],
        divisa: "EUR",
        condicionesPago: "Transferencia bancaria a 30 días fecha factura",
        condicionesDevolucion: "Devolución en 30 días",
        descuentosVolumen: 10
    },
    {
        nombreComercial: "Oysho",
        cp: "08490",
        email: "proveedores@oysho.example",
        telefono: 937000006,
        web: "https://www.oysho.com",
        tipoProducto: ["Lencería", "Ropa deportiva", "Ropa de baño", "Pijamas"],
        divisa: "EUR",
        condicionesPago: "Transferencia bancaria a 45 días fecha factura",
        condicionesDevolucion: "Sin devolución en lencería y baño salvo defecto de fabricación",
        descuentosVolumen: 7
    },
    {
        nombreComercial: "Lefties",
        cp: "15143",
        email: "proveedores@lefties.example",
        telefono: 981000007,
        web: "https://www.lefties.com",
        tipoProducto: ["Ropa de mujer", "Ropa de hombre", "Ropa infantil", "Hogar"],
        divisa: "EUR",
        condicionesPago: "Pago al contado con un 2% de descuento",
        condicionesDevolucion: "Devolución en 15 días",
        descuentosVolumen: 15
    },
    {
        nombreComercial: "Mango",
        cp: "08184",
        email: "proveedores@mango.example",
        telefono: 938000008,
        web: "https://www.mango.com",
        tipoProducto: ["Ropa de mujer", "Ropa de hombre", "Ropa infantil", "Accesorios"],
        divisa: "EUR",
        condicionesPago: "Transferencia bancaria a 60 días fecha factura",
        condicionesDevolucion: "Devolución en 30 días",
        descuentosVolumen: 11
    },
    {
        nombreComercial: "Desigual",
        cp: "08039",
        email: "proveedores@desigual.example",
        telefono: 932000009,
        web: "https://www.desigual.com",
        tipoProducto: ["Ropa de mujer", "Ropa de hombre", "Bolsos", "Accesorios"],
        divisa: "EUR",
        condicionesPago: "Confirming a 90 días",
        condicionesDevolucion: "Devolución de mercancía defectuosa en 30 días",
        descuentosVolumen: 9
    },
    {
        nombreComercial: "Springfield",
        cp: "28034",
        email: "proveedores@springfield.example",
        telefono: 910000010,
        web: "https://www.springfield.com",
        tipoProducto: ["Ropa de hombre", "Ropa de mujer", "Denim", "Calzado"],
        divisa: "EUR",
        condicionesPago: "Transferencia bancaria a 30 días fecha factura",
        condicionesDevolucion: "Devolución en 30 días",
        descuentosVolumen: 10
    },
    {
        nombreComercial: "Cortefiel",
        cp: "28034",
        email: "proveedores@cortefiel.example",
        telefono: 910000011,
        web: "https://www.cortefiel.com",
        tipoProducto: ["Ropa de hombre", "Ropa de mujer", "Trajes", "Abrigos"],
        divisa: "EUR",
        condicionesPago: "Transferencia bancaria a 60 días fecha factura",
        condicionesDevolucion: "Devolución en 30 días",
        descuentosVolumen: 6
    },
    {
        nombreComercial: "El Ganso",
        cp: "28046",
        email: "proveedores@elganso.example",
        telefono: 910000012,
        web: "https://www.elganso.com",
        tipoProducto: ["Ropa de hombre", "Ropa de mujer", "Calzado", "Complementos"],
        divisa: "EUR",
        condicionesPago: "Transferencia bancaria a 45 días fecha factura",
        condicionesDevolucion: "Devolución de mercancía defectuosa en 15 días",
        descuentosVolumen: 5
    }
];

async function sembrar() {
    await conectar();
    await Proveedor.deleteMany({});
    const insertados = await Proveedor.insertMany(proveedores);
    console.log(`Insertados ${insertados.length} proveedores en la colección ${Proveedor.collection.name}`);
}

sembrar()
    .catch(error => {
        console.error(error.message);
        process.exitCode = 1;
    })
    .finally(desconectar);
