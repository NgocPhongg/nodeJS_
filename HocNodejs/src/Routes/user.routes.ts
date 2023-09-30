import express from 'express'
import { loginValidator, registerVadidator } from '~/Middlewares/user.middeleware'
import { loginController, registerController } from '~/Controllers/user.controller'

import { wrapRequestHandler } from '~/Utils/handlers'
const userRoutes = express.Router()

userRoutes.post('/login', loginValidator, loginController)
userRoutes.post('/register', registerVadidator, wrapRequestHandler(registerController))

export default userRoutes
