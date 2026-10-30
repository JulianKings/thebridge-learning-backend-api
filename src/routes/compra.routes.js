const express = require("express");
const { crear, mias, listar, obtenerPorId, cambiarEstado, eliminar } = require("../controllers/compra.controller");
const autenticar = require("../middleware/autenticar");
const autorizar = require("../middleware/autorizar");

const router = express.Router();

/**
 * @openapi
 * /compras:
 *   post:
 *     tags: [Compras]
 *     summary: Un cliente compra (descuenta stock y suma 1 punto por euro)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CompraInput' }
 *     responses:
 *       201:
 *         description: Compra registrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Compra' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *       409:
 *         description: Sin stock suficiente o producto no disponible
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *   get:
 *     tags: [Compras]
 *     summary: Todas las compras, con filtros, orden y paginación (empleados y administradores)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: cliente, in: query, schema: { type: string }, description: "_id de uno o varios clientes separados por comas" }
 *       - $ref: '#/components/parameters/EstadoCompra'
 *       - $ref: '#/components/parameters/Desde'
 *       - $ref: '#/components/parameters/Hasta'
 *       - { name: totalMin, in: query, schema: { type: number } }
 *       - { name: totalMax, in: query, schema: { type: number } }
 *       - $ref: '#/components/parameters/OrdenCompra'
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
 *               items: { $ref: '#/components/schemas/Compra' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 */
router.post("/", autenticar, autorizar("cliente"), crear);
router.get("/", autenticar, autorizar("empleado", "administrador"), listar);

/**
 * @openapi
 * /compras/mias:
 *   get:
 *     tags: [Compras]
 *     summary: Compras del cliente que ha iniciado sesión
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/EstadoCompra'
 *       - $ref: '#/components/parameters/Desde'
 *       - $ref: '#/components/parameters/Hasta'
 *       - $ref: '#/components/parameters/OrdenCompra'
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
 *               items: { $ref: '#/components/schemas/Compra' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 */
router.get("/mias", autenticar, autorizar("cliente"), mias);

/**
 * @openapi
 * /compras/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/Id'
 *   get:
 *     tags: [Compras]
 *     summary: Obtener una compra (un cliente solo puede ver las suyas)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Compra' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *   patch:
 *     tags: [Compras]
 *     summary: Cambiar el estado de una compra (empleados y administradores). Cancelarla devuelve el stock y resta los puntos
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CompraEstado' }
 *     responses:
 *       200:
 *         description: Compra actualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Compra' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *       409:
 *         description: La compra ya está cancelada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *   delete:
 *     tags: [Compras]
 *     summary: Eliminar una compra (administradores). Si no estaba cancelada, devuelve el stock y resta los puntos
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Compra eliminada }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 */
router.get("/:id", autenticar, obtenerPorId);
router.patch("/:id", autenticar, autorizar("empleado", "administrador"), cambiarEstado);
router.delete("/:id", autenticar, autorizar("administrador"), eliminar);

module.exports = router;
