const cors = require('cors')
const express = require('express')
const ropaRouter = require('./routes/producto.routes');
const proveedorRouter = require('./routes/proveedor.routes')
const authRouter = require('./routes/auth.routes')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec))

app.use('/', ropaRouter);
app.use('/proveedores', proveedorRouter);
app.use('/auth', authRouter);


app.use((req, res) => {
  res.status(404).json({ message: `No existe la ruta ${req.method} ${req.originalUrl}` })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' })
})

module.exports = app
