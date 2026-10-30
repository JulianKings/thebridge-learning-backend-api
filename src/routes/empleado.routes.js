const express = require("express");
const autenticar = require("../middleware/autenticar");
const autorizar = require("../middleware/autorizar");
const empleadoController = require("../controllers/empleado.controller");

const router = express.Router();

router.use(autenticar, autorizar("administrador"));

/**
 * @openapi
 * /empleados:
 *   get:
 *     tags: [Empleado]
 *     summary: Listar los empleados, con filtros, orden y paginación
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/Q'
 *       - $ref: '#/components/parameters/Genero'
 *       - { name: cargo, in: query, schema: { type: string }, description: "reponedor, dependiente o encargado (admite varios separados por comas)" }
 *       - { name: vacaciones, in: query, schema: { type: boolean } }
 *       - { name: salarioMin, in: query, schema: { type: number } }
 *       - { name: salarioMax, in: query, schema: { type: number } }
 *       - { name: orden, in: query, schema: { type: string }, description: "nombre, email, cargo, salario, createdAt (con - delante para descendente)" }
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
 *               items: { $ref: '#/components/schemas/Empleado' }
 *   post:
 *     tags: [Empleado]
 *     summary: Crear un empleado
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/EmpleadoInput' }
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       201:
 *         description: Empleado creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Empleado' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       409: { $ref: '#/components/responses/Duplicado' }
 */
router.get("/", empleadoController.listar);
router.post("/", empleadoController.crear);

/**
 * @openapi
 * /empleados/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/Id'
 *   get:
 *     tags: [Empleado]
 *     summary: Obtener un empleado por id
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Empleado' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *   put:
 *     tags: [Empleado]
 *     summary: Reemplazar un empleado completo
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/EmpleadoInput' }
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       200:
 *         description: Empleado reemplazado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Empleado' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *       409: { $ref: '#/components/responses/Duplicado' }
 *   patch:
 *     tags: [Empleado]
 *     summary: Actualizar parcialmente un Empleado
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/EmpleadoPatch' }
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       200:
 *         description: Empleado actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Empleado' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 *       409: { $ref: '#/components/responses/Duplicado' }
 *   delete:
 *     tags: [Empleado]
 *     summary: Eliminar un empleado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       403: { $ref: '#/components/responses/SinPermiso' }
 *       204: { description: Empleado eliminado }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 */
router.get("/:id", empleadoController.obtenerPorId);
router.put("/:id", empleadoController.reemplazar);
router.patch("/:id", empleadoController.actualizar);
router.delete("/:id", empleadoController.eliminar);

module.exports = router;
