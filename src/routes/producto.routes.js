const express = require('express');
const router = express.Router();
const { getStatus, listar, filtros, obtenerPorId, crear, reemplazar, actualizar, eliminar } = require('../controllers/producto.controller');
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
 *     summary: Listar los productos, con filtros, orden y paginación opcionales
 *     parameters:
 *       - $ref: "#/components/parameters/Q"
 *       - { name: tipo, in: query, schema: { type: string }, description: "Uno o varios tipos separados por comas (camisa,polo)" }
 *       - { name: grupo, in: query, schema: { type: string }, description: "arriba, abajo, vestidos, calzado, accesorios o mas (admite varios separados por comas)" }
 *       - { name: talla, in: query, schema: { type: string }, description: "Tallas con stock, separadas por comas (S,M)" }
 *       - { name: temporada, in: query, schema: { type: string }, description: Temporadas separadas por comas }
 *       - { name: proveedor, in: query, schema: { type: string }, description: "_id de uno o varios proveedores separados por comas" }
 *       - { name: precioMin, in: query, schema: { type: number }, description: Precio mínimo ya con el descuento aplicado }
 *       - { name: precioMax, in: query, schema: { type: number }, description: Precio máximo ya con el descuento aplicado }
 *       - { name: oferta, in: query, schema: { type: boolean }, description: Solo los productos con descuento }
 *       - { name: disponible, in: query, schema: { type: boolean } }
 *       - { name: orden, in: query, schema: { type: string, enum: [precio, -precio, descuento, -descuento, createdAt, -createdAt, tipo, -tipo] }, description: "El precio se ordena con el descuento aplicado" }
 *       - $ref: "#/components/parameters/Page"
 *       - $ref: "#/components/parameters/Limit"
 *     responses:
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       200:
 *         description: OK
 *         headers:
 *           X-Total-Count: { $ref: "#/components/headers/TotalCount" }
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
 * /ropa/filtros:
 *   get:
 *     tags: [Productos]
 *     summary: Valores disponibles para filtrar el catálogo (grupos, tallas, temporadas, proveedores y rango de precios)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/FiltrosRopa" }
 */
router.get("/ropa/filtros", filtros);

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
