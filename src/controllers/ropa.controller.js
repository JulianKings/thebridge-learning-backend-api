async function obtener (req, res) {
    res.status(200).json({status: "ok"});
}

module.exports = { obtener };