import express from 'express'
import { loginValidator, registerVadidator } from '~/Middlewares/user.middeleware'
import { loginController, registerController } from '~/Controllers/user.controller'
import { validate } from '~/Utils/validation'
const userRoutes = express.Router()

userRoutes.post('/login', loginValidator, loginController)
userRoutes.post('/register', registerVadidator, registerController)

export default userRoutes
