const mongoose = require("mongoose");

async function conectar() {
    await mongoose.connect(process.env.MONGODB_URI, {dbName: process.env.DB_NAME});
    console.log(`Conectado a Mongo ${mongoose.connection.name}`);
}

async function desconectar() {
    await mongoose.disconnect();
}

module.exports = { conectar, desconectar }