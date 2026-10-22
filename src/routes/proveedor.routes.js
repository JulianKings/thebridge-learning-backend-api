const express = require("express");
const proveedorController = require("../controllers/proveedor.controller");

const router = express.Router();

router.get("/", proveedorController.listar);
router.get("/:id", proveedorController.obtenerPorId);
router.post("/", proveedorController.crear);
router.put("/:id", proveedorController.reemplazar);
router.patch("/:id", proveedorController.actualizar);
router.delete("/:id", proveedorController.eliminar);

module.exports = router;
