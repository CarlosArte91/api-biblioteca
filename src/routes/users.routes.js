import { Router } from 'express'
import { createUser, getUsers, updateUser } from '../controllers/users.controllers.js'

const router = Router()

router.post('/users', createUser)
router.get('/users', getUsers)
router.patch('/users', updateUser)

export default router
