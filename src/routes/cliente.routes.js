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
 *     summary: Listar los clientes, con filtros, orden y paginación (administradores)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/Q'
 *       - $ref: '#/components/parameters/Genero'
 *       - { name: puntosMin, in: query, schema: { type: integer } }
 *       - { name: puntosMax, in: query, schema: { type: integer } }
 *       - { name: orden, in: query, schema: { type: string }, description: "nombre, email, puntos, createdAt (con - delante para descendente)" }
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
 *               items: { $ref: '#/components/schemas/Cliente' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *   post:
 *     tags: [Clientes]
 *     summary: Crear un cliente
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClienteInput' }
 *     responses:
 *       201:
 *         description: Cliente creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Cliente' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       409: { $ref: '#/components/responses/Duplicado' }
 */
router.get("/", clienteController.listar);
router.post("/", clienteController.crear);

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
 *   put:
 *     tags: [Clientes]
 *     summary: Reemplazar un cliente completo
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClienteInput' }
 *     responses:
 *       200:
 *         description: Cliente reemplazado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Cliente' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *       409: { $ref: '#/components/responses/Duplicado' }
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
router.put("/:id", clienteController.reemplazar);
router.patch("/:id", clienteController.actualizar);
router.delete("/:id", clienteController.eliminar);

module.exports = router;
