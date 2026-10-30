const express = require("express");
const empleadoController = require("../controllers/empleado.controller");

const router = express.Router();

/**
 * @openapi
 * /empleado:
 *   get:
 *     tags: [Empleado]
 *     summary: Listar todos los empleados
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Empleado' }
 *   post:
 *     tags: [Empleado]
 *     summary: Crear un empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/EmpleadoInput' }
 *     responses:
 *       201:
 *         description: Empleado creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Empleado' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       409: { $ref: '#/components/responses/Duplicado' }
 */
router.get("/", empleadoControllerController.listar);
router.post("/", empleadoControllerController.crear);

/**
 * @openapi
 * /empleado/{id}:
 *   parameters:
 *     - $ref: '#/empleado/parameters/Id'
 *   get:
 *     tags: [Empleado]
 *     summary: Obtener un proveedor por id
 *     responses:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/EmpleadoInput' }
 *     responses:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/EmpleadoPatch' }
 *     responses:
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
 *     responses:
 *       204: { description: Empleado eliminado }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 */
router.get("/:id", empleadoController.obtenerPorId);
router.put("/:id", empleadoController.reemplazar);
router.patch("/:id", empleadoController.actualizar);
router.delete("/:id", empleadoController.eliminar);

module.exports = router;
