const express = require('express');
const router = express.Router();
const { getStatus, listar, obtenerPorId, crear, reemplazar, actualizar, eliminar } = require('../controllers/producto.controller');

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
 *     summary: Listar todos los productos
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductoInput' }
 *     responses:
 *       201:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Producto' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 */
router.get("/ropa", listar);
router.post("/ropa", crear);

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductoInput' }
 *     responses:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductoPatch' }
 *     responses:
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
 *     responses:
 *       204: { description: Producto eliminado }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 */
router.get("/ropa/:id", obtenerPorId);
router.put("/ropa/:id", reemplazar);
router.patch("/ropa/:id", actualizar);
router.delete("/ropa/:id", eliminar);

module.exports = router;
