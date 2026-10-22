const express = require('express');
const router = express.Router();
const { getStatus, listar, obtenerPorId, crear, reemplazar, actualizar, eliminar } = require('../controllers/producto.controller');

router.get('/status', getStatus);

router.get("/ropa", listar);
router.get("/ropa/:id", obtenerPorId);
router.post("/ropa", crear);
router.put("/ropa/:id", reemplazar);
router.patch("/ropa/:id", actualizar);
router.delete("/ropa/:id", eliminar);

module.exports = router;
