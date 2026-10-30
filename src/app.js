const cors = require('cors')
const express = require('express')
const ropaRouter = require('./routes/producto.routes')
const proveedorRouter = require('./routes/proveedor.routes')
const authRouter = require('./routes/auth.routes')
const compraRouter = require('./routes/compra.routes')
const clienteRouter = require('./routes/cliente.routes')
const empleadoRouter = require('./routes/empleado.routes')
const administradorRouter = require('./routes/administrador.routes')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')

const ORIGENES_POR_DEFECTO = 'https://thebridgelearningapi.netlify.app,http://localhost:5173'
const origenes = (process.env.CORS_ORIGINS ?? ORIGENES_POR_DEFECTO)
  .split(',')
  .map((origen) => origen.trim().replace(/\/$/, ''))
  .filter(Boolean)

const app = express()

app.use(cors({ origin: origenes, credentials: true }))
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec))

app.use('/', ropaRouter)
app.use('/proveedores', proveedorRouter)
app.use('/auth', authRouter)
app.use('/compras', compraRouter)
app.use('/clientes', clienteRouter)
app.use('/empleados', empleadoRouter)
app.use('/administradores', administradorRouter)

app.use((req, res) => {
  res.status(404).json({ error: `No existe la ruta ${req.method} ${req.originalUrl}` })
})

app.use((err, req, res, next) => {
  if (!err.status || err.status >= 500) console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' })
})

module.exports = app
