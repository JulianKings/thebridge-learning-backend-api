const express = require("express");
const {registro} = require("../controller/auth.controller.js");

const router = express.Router();


// AQUI DEBBEIS COMENTAR SWAGGER, CUIDADO!!

router.post("/registro", registro);

module.exports = router;