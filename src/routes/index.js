import { Router } from 'express'
import statusRoutes from './status.routes.js'

const router = Router()

router.use('/status', statusRoutes)

export default router
