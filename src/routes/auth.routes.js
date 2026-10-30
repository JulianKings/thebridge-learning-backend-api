const express = require("express");
const {registro} = require("../controllers/auth.controller");

const router = express.Router();


// AQUI DEBBEIS COMENTAR SWAGGER, CUIDADO!!

router.post("/registro", registro);

module.exports = router;