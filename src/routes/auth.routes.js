const express = require("express");
const {registro, login} = require("../controllers/auth.controller");

const router = express.Router();


// AQUI DEBBEIS COMENTAR SWAGGER, CUIDADO!!

router.post("/registro", registro);
router.post("/login", login);

module.exports = router;