const express = require('express');
const router = express.Router();
const { getStatus, listar, obtenerPorId, crear, reemplazar, actualizar, eliminar } = require('../controllers/producto.controller');
const autenticar = require('../middleware/autenticar');
const autorizar = require('../middleware/autorizar');

const soloPersonal = [autenticar, autorizar('empleado', 'administrador')];

/**
 * @openapi
 * /status:
 *   get:
 *     tags: [Estado]
 *     summary: Estado de la API y de la conexión a la base de datos
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: ok }
 *                 db: { type: string, enum: [conectada, no conectada] }
 */
router.get('/status', getStatus);

/**
 * @openapi
 * /ropa:
 *   get:
 *     tags: [Productos]
 *     summary: Listar los productos, con filtro por tipo y paginación opcionales
 *     parameters:
 *       - { name: tipo, in: query, schema: { type: string }, description: Solo los productos de ese tipo }
 *       - { name: page, in: query, schema: { type: integer, minimum: 1 }, description: Página (empieza en 1), junto con limit }
 *       - { name: limit, in: query, schema: { type: integer, minimum: 1 }, description: Productos por página }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Producto' }
 *   post:
 *     tags: [Productos]
 *     summary: Crear un producto
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductoInput' }
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       201:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Producto' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 */
router.get("/ropa", listar);
router.post("/ropa", soloPersonal, crear);

/**
 * @openapi
 * /ropa/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/Id'
 *   get:
 *     tags: [Productos]
 *     summary: Obtener un producto por id
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Producto' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *   put:
 *     tags: [Productos]
 *     summary: Reemplazar un producto completo
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductoInput' }
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       200:
 *         description: Producto reemplazado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Producto' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *   patch:
 *     tags: [Productos]
 *     summary: Actualizar parcialmente un producto
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductoPatch' }
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Producto' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *   delete:
 *     tags: [Productos]
 *     summary: Eliminar un producto
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       204: { description: Producto eliminado }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 */
router.get("/ropa/:id", obtenerPorId);
router.put("/ropa/:id", soloPersonal, reemplazar);
router.patch("/ropa/:id", soloPersonal, actualizar);
router.delete("/ropa/:id", soloPersonal, eliminar);

module.exports = router;
