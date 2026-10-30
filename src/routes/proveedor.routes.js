const express = require("express");
const proveedorController = require("../controllers/proveedor.controller");
const autenticar = require("../middleware/autenticar");
const autorizar = require("../middleware/autorizar");
const router = express.Router();

const soloAdministrador = [autenticar, autorizar("administrador")];

/**
 * @openapi
 * /proveedores:
 *   get:
 *     tags: [Proveedores]
 *     summary: Listar los proveedores, con filtros, orden y paginación
 *     parameters:
 *       - $ref: '#/components/parameters/Q'
 *       - { name: divisa, in: query, schema: { type: string }, description: "Una o varias divisas separadas por comas (EUR,USD)" }
 *       - { name: tipoProducto, in: query, schema: { type: string }, description: Tipos de producto separados por comas }
 *       - { name: descuentosVolumenMin, in: query, schema: { type: number } }
 *       - { name: descuentosVolumenMax, in: query, schema: { type: number } }
 *       - { name: orden, in: query, schema: { type: string }, description: "nombreComercial, descuentosVolumen, divisa (con - delante para descendente)" }
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: OK
 *         headers:
 *           X-Total-Count: { $ref: '#/components/headers/TotalCount' }
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Proveedor' }
 *   post:
 *     tags: [Proveedores]
 *     summary: Crear un proveedor
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProveedorInput' }
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       201:
 *         description: Proveedor creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Proveedor' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       409: { $ref: '#/components/responses/Duplicado' }
 */
router.get("/", proveedorController.listar);
router.post("/", soloAdministrador, proveedorController.crear);

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
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProveedorInput' }
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
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
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProveedorPatch' }
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
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
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       204: { description: Proveedor eliminado }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 */
router.get("/:id", proveedorController.obtenerPorId);
router.put("/:id", soloAdministrador, proveedorController.reemplazar);
router.patch("/:id", soloAdministrador, proveedorController.actualizar);
router.delete("/:id", soloAdministrador, proveedorController.eliminar);

module.exports = router;
