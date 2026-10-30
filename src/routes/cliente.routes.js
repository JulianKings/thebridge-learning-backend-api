const express = require("express");
const clienteController = require("../controllers/cliente.controller");
const autenticar = require("../middleware/autenticar");
const autorizar = require("../middleware/autorizar");

const router = express.Router();

router.use(autenticar, autorizar("administrador"));

/**
 * @openapi
 * /clientes:
 *   get:
 *     tags: [Clientes]
 *     summary: Listar los clientes (administradores)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Cliente' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 */
router.get("/", clienteController.listar);

/**
 * @openapi
 * /clientes/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/Id'
 *   get:
 *     tags: [Clientes]
 *     summary: Obtener un cliente por id
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Cliente' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *   patch:
 *     tags: [Clientes]
 *     summary: Actualizar parcialmente un cliente (p. ej. sus puntos)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClientePatch' }
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Cliente' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *       409: { $ref: '#/components/responses/Duplicado' }
 *   delete:
 *     tags: [Clientes]
 *     summary: Eliminar un cliente
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Cliente eliminado }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 */
router.get("/:id", clienteController.obtenerPorId);
router.patch("/:id", clienteController.actualizar);
router.delete("/:id", clienteController.eliminar);

module.exports = router;
