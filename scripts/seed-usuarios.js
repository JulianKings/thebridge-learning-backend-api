require("dotenv").config();
const { conectar, desconectar } = require("../src/config/config");
const Cliente = require("../src/models/Cliente");
const Empleado = require("../src/models/Empleado");
const Administrador = require("../src/models/Administrador");

const clientes = [
    {
        nombre: "Lucía Fernández",
        email: "lucia.cliente@thebridge.tech",
        password: "Cliente1234!",
        fechaNacimiento: "14/03/1995",
        genero: "Mujer",
        cp: "28013",
        puntos: 120,
        afiliado: "THEBRIDGE-0001"
    },
    {
        nombre: "Pablo Martín",
        email: "pablo.cliente@thebridge.tech",
        password: "Cliente1234!",
        fechaNacimiento: "02/11/1988",
        genero: "Hombre",
        cp: "08001",
        puntos: 45
    },
    {
        nombre: "Carmen Ruiz",
        email: "carmen.cliente@thebridge.tech",
        password: "Cliente1234!",
        fechaNacimiento: "27/07/2001",
        genero: "Mujer",
        cp: "41004",
        puntos: 0
    }
];

const empleados = [
    {
        nombre: "Javier López",
        email: "javier.empleado@thebridge.tech",
        password: "Empleado1234!",
        fechaNacimiento: "09/05/1990",
        genero: "Hombre",
        cp: "28004",
        cargo: "dependiente",
        altaSS: "01/09/2023",
        salario: 1350,
        horario: "L-V 10:00-18:00",
        vacaciones: false
    },
    {
        nombre: "Marta Sánchez",
        email: "marta.empleado@thebridge.tech",
        password: "Empleado1234!",
        fechaNacimiento: "21/12/1997",
        genero: "Mujer",
        cp: "46002",
        cargo: "reponedor",
        altaSS: "15/02/2024",
        salario: 1250,
        horario: "L-S 07:00-13:00",
        vacaciones: true
    },
    {
        nombre: "Andrés Gómez",
        email: "andres.empleado@thebridge.tech",
        password: "Empleado1234!",
        fechaNacimiento: "30/08/1984",
        genero: "Hombre",
        cp: "15003",
        cargo: "encargado",
        altaSS: "10/01/2019",
        salario: 1900,
        horario: "L-V 09:00-17:00",
        vacaciones: false
    },
    // Cuenta especial para el comprobador de tests: se usa para probar las rutas protegidas
    // una vez exista el login. Tiene el cargo más alto para poder acceder a todo lo de empleados.
    {
        nombre: "Tester TheBridge",
        email: "tester@thebridge.tech",
        password: "Tester1234!",
        fechaNacimiento: "01/01/1990",
        genero: "Hombre",
        cp: "28001",
        cargo: "encargado",
        altaSS: "01/01/2026",
        salario: 0,
        horario: "Cuenta de pruebas",
        vacaciones: false
    }
];

const administradores = [
    {
        nombre: "Admin TheBridge",
        email: "admin@thebridge.tech",
        password: "Admin1234!",
        fechaNacimiento: "15/06/1985",
        genero: "Mujer"
    }
];

// create() (a diferencia de insertMany) ejecuta el pre("save") del modelo, que hashea la contraseña con bcrypt
async function sembrarModelo(Modelo, cuentas) {
    await Modelo.deleteMany({ email: { $in: cuentas.map(c => c.email) } });
    const insertados = await Modelo.create(cuentas);
    console.log(`${Modelo.modelName}: ${insertados.length} cuentas (${insertados.map(c => c.email).join(", ")})`);
}

async function sembrar() {
    await conectar();
    await sembrarModelo(Cliente, clientes);
    await sembrarModelo(Empleado, empleados);
    await sembrarModelo(Administrador, administradores);
}

sembrar()
    .catch(error => {
        console.error(error.message);
        process.exitCode = 1;
    })
    .finally(desconectar);
