const express = require("express");
const { crear, mias, listar } = require("../controllers/compra.controller");
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
 *     summary: Todas las compras (empleados y administradores)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Compra' }
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
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Compra' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 */
router.get("/mias", autenticar, autorizar("cliente"), mias);

module.exports = router;
