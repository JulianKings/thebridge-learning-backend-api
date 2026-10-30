const express = require("express");
const autenticar = require("../middleware/autenticar");
const autorizar = require("../middleware/autorizar");
const administradorController = require("../controllers/administrador.controller");

const router = express.Router();

router.use(autenticar, autorizar("administrador"));

/**
 * @openapi
 * /administradores:
 *   get:
 *     tags: [Administrador]
 *     summary: Listar los administradores, con filtros, orden y paginación
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/Q'
 *       - $ref: '#/components/parameters/Genero'
 *       - { name: orden, in: query, schema: { type: string }, description: "nombre, email, createdAt (con - delante para descendente)" }
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       200:
 *         description: OK
 *         headers:
 *           X-Total-Count: { $ref: '#/components/headers/TotalCount' }
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Administrador' }
 *   post:
 *     tags: [Administrador]
 *     summary: Crear un administrador
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AdministradorInput' }
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       201:
 *         description: Administrador creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Administrador' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       409: { $ref: '#/components/responses/Duplicado' }
 */
router.get("/", administradorController.listar);
router.post("/", administradorController.crear);

/**
 * @openapi
 * /administradores/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/Id'
 *   get:
 *     tags: [Administrador]
 *     summary: Obtener un administrador por id
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Administrador' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *   put:
 *     tags: [Administrador]
 *     summary: Reemplazar un administrador completo
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AdministradorInput' }
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       200:
 *         description: Administrador reemplazado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Administrador' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *       409: { $ref: '#/components/responses/Duplicado' }
 *   patch:
 *     tags: [Administrador]
 *     summary: Actualizar parcialmente un administrador
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AdministradorPatch' }
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       200:
 *         description: Administrador actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Administrador' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *       409: { $ref: '#/components/responses/Duplicado' }
 *   delete:
 *     tags: [Administrador]
 *     summary: Eliminar un administrador
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       204: { description: Administrador eliminado }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 */
router.get("/:id", administradorController.obtenerPorId);
router.put("/:id", administradorController.reemplazar);
router.patch("/:id", administradorController.actualizar);
router.delete("/:id", administradorController.eliminar);

module.exports = router;
