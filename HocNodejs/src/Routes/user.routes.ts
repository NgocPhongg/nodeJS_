import express from 'express'

import {
  accsessTokenValidator,
  loginValidator,
  registerVadidator,
  refreshTokenValidator,
  emailVerifyTokenValidator,
  forgotPassWordValidator,
  updateAdressValidator
} from '~/Middlewares/user.middeleware'
import {
  allMeProfileController,
  deleteUserController,
  emailVerifyController,
  forgotPasswordController,
  loginController,
  logoutController,
  meProfileController,
  registerController,
  resendEmailVerifyController,
  searchUserController,
  updateMeController
} from '~/Controllers/user.controller'

import { wrapRequestHandler } from '~/Utils/handlers'

const userRoutes = express.Router()
/**
 * Description . login user
 * path:/login
 * Method: post
 * Body:{email:string,passwordLstring}
 */
userRoutes.post('/login', loginValidator, wrapRequestHandler(loginController))
userRoutes.post('/register', registerVadidator, wrapRequestHandler(registerController))
userRoutes.post('/logout', accsessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
userRoutes.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(emailVerifyController))
userRoutes.post('/resend-verify-email', accsessTokenValidator, wrapRequestHandler(resendEmailVerifyController))
userRoutes.post('/forgot-password', forgotPassWordValidator, wrapRequestHandler(forgotPasswordController))
userRoutes.get('/me-profile', accsessTokenValidator, wrapRequestHandler(meProfileController))
userRoutes.get('/admin-profile', wrapRequestHandler(meProfileController))

userRoutes.patch('/updateMe', accsessTokenValidator, updateAdressValidator, wrapRequestHandler(updateMeController))
userRoutes.get('/allmetable-profile', wrapRequestHandler(allMeProfileController))
userRoutes.post('/deleteUser', wrapRequestHandler(deleteUserController))
userRoutes.post('/search-user', wrapRequestHandler(searchUserController))
export default userRoutes
