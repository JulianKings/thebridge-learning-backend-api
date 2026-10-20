const {MongoClient} = require("mongodb");

let client;
let database;

async function conectar() {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    database = client.db(process.env.DB_NAME);
    console.log(`Conectado a Mongo ${database.databaseName}`);
}

function getDatabase() {
    if (!database) throw new Error("Sin conexion");
    return database;
}

async function desconectar() {
    await client.close();
}

module.exports = { conectar, getDatabase, desconectar }