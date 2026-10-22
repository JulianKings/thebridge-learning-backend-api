const mongoose = require("mongoose");

const getStatus = (req, res) => {
    res.status(200).json({ status: "ok", db: (mongoose.connection.readyState) ? "conectado": "no conectada"});
};

module.exports = {getStatus};