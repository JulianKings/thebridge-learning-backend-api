const express = require("express");
const proveedorController = require("../controllers/proveedor.controller");
const autenticar = require("../middleware/autenticar");
const autorizar = require("../middleware/autorizar");
const router = express.Router();

/**
 * @openapi
 * /proveedores:
 *   get:
 *     tags: [Proveedores]
 *     summary: Listar todos los proveedores
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Proveedor' }
 *   post:
 *     tags: [Proveedores]
 *     summary: Crear un proveedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProveedorInput' }
 *     responses:
 *       201:
 *         description: Proveedor creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Proveedor' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       409: { $ref: '#/components/responses/Duplicado' }
 */
router.get("/", proveedorController.listar);
router.post("/", autenticar, autorizar("administrador"), proveedorController.crear);

/**
 * @openapi
 * /proveedores/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/Id'
 *   get:
 *     tags: [Proveedores]
 *     summary: Obtener un proveedor por id
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Proveedor' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *   put:
 *     tags: [Proveedores]
 *     summary: Reemplazar un proveedor completo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProveedorInput' }
 *     responses:
 *       200:
 *         description: Proveedor reemplazado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Proveedor' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *       409: { $ref: '#/components/responses/Duplicado' }
 *   patch:
 *     tags: [Proveedores]
 *     summary: Actualizar parcialmente un proveedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProveedorPatch' }
 *     responses:
 *       200:
 *         description: Proveedor actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Proveedor' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *       409: { $ref: '#/components/responses/Duplicado' }
 *   delete:
 *     tags: [Proveedores]
 *     summary: Eliminar un proveedor
 *     responses:
 *       204: { description: Proveedor eliminado }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 */
router.get("/:id", proveedorController.obtenerPorId);
router.put("/:id", proveedorController.reemplazar);
router.patch("/:id", proveedorController.actualizar);
router.delete("/:id", proveedorController.eliminar);

module.exports = router;
