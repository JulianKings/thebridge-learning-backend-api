const cors = require('cors')
const express = require('express')

const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res) => {
  res.status(404).json({ message: `No existe la ruta ${req.method} ${req.originalUrl}` })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' })
})

module.exports = app
