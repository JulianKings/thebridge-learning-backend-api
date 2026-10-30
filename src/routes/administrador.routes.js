const express = require("express");
const administradorController = require("../controllers/administrador.controller");

const router = express.Router();

/**
 * @openapi
 * /administrador:
 *   get:
 *     tags: [Administrador]
 *     summary: Listar todos los administrador
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Administrador' }
 *   post:
 *     tags: [Administrador]
 *     summary: Crear un administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AdministradorInput' }
 *     responses:
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
 * /administrador/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/Id'
 *   get:
 *     tags: [Administrador]
 *     summary: Obtener un administrador por id
 *     responses:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AdministradorInput' }
 *     responses:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AdministradorPatch' }
 *     responses:
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
 *     responses:
 *       204: { description: Administrador eliminado }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 */
router.get("/:id", administradorController.obtenerPorId);
router.put("/:id", administradorController.reemplazar);
router.patch("/:id", administradorController.actualizar);
router.delete("/:id", administradorController.eliminar);

module.exports = router;
