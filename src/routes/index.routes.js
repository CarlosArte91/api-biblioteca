import { Router } from 'express'
import booksRoutes from './books.routes.js'
import usersRoutes from './users.routes.js'

const router = Router()

router.use(booksRoutes)
router.use(usersRoutes)

export default router
