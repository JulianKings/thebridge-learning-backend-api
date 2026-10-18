import cors from 'cors'
import express from 'express'
import routes from './routes/index.js'

const app = express()

// The progress site calls the API from the browser, so CORS must be on from
// day one. It's open to any origin for now; restricting it is part of step 6.
app.use(cors())
app.use(express.json())

app.use('/api', routes)

app.use((req, res) => {
  res.status(404).json({ message: `No existe la ruta ${req.method} ${req.originalUrl}` })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' })
})

export default app
