const express = require("express");
const { registro, login, perfil } = require("../controllers/auth.controller");
const autenticar = require("../middleware/autenticar");

const router = express.Router();

/**
 * @openapi
 * /auth/registro:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegistroInput' }
 *     responses:
 *       201:
 *         description: Cliente creado y token de sesión
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 cliente: { $ref: '#/components/schemas/Cliente' }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       409: { $ref: '#/components/responses/Duplicado' }
 */
router.post("/registro", registro);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión (clientes, empleados y administradores)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginInput' }
 *     responses:
 *       200:
 *         description: Token JWT y datos del usuario (en "cliente", "empleado" o "administrador")
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *       400: { $ref: '#/components/responses/ErrorValidacion' }
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 */
router.post("/login", login);

/**
 * @openapi
 * /auth/perfil:
 *   get:
 *     tags: [Auth]
 *     summary: Perfil del usuario del token
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Datos del usuario, sin contraseña
 *       401: { $ref: '#/components/responses/NoAutenticado' }
 *       404: { $ref: '#/components/responses/NoEncontrado' }
 */
router.get("/perfil", autenticar, perfil);

module.exports = router;
