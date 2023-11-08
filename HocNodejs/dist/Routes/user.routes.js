"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_middeleware_1 = require("../Middlewares/user.middeleware");
const user_controller_1 = require("../Controllers/user.controller");
const handlers_1 = require("../Utils/handlers");
const userRoutes = express_1.default.Router();
/**
 * Description . login user
 * path:/login
 * Method: post
 * Body:{email:string,passwordLstring}
 */
userRoutes.post('/login', user_middeleware_1.loginValidator, (0, handlers_1.wrapRequestHandler)(user_controller_1.loginController));
userRoutes.post('/register', user_middeleware_1.registerVadidator, (0, handlers_1.wrapRequestHandler)(user_controller_1.registerController));
userRoutes.post('/logout', user_middeleware_1.accsessTokenValidator, user_middeleware_1.refreshTokenValidator, (0, handlers_1.wrapRequestHandler)(user_controller_1.logoutController));
userRoutes.post('/verify-email', user_middeleware_1.emailVerifyTokenValidator, (0, handlers_1.wrapRequestHandler)(user_controller_1.emailVerifyController));
userRoutes.post('/resend-verify-email', user_middeleware_1.accsessTokenValidator, (0, handlers_1.wrapRequestHandler)(user_controller_1.resendEmailVerifyController));
userRoutes.post('/forgot-password', user_middeleware_1.forgotPassWordValidator, (0, handlers_1.wrapRequestHandler)(user_controller_1.forgotPasswordController));
userRoutes.get('/me-profile', user_middeleware_1.accsessTokenValidator, (0, handlers_1.wrapRequestHandler)(user_controller_1.meProfileController));
userRoutes.patch('/updateMe', user_middeleware_1.accsessTokenValidator, user_middeleware_1.updateAdressValidator, (0, handlers_1.wrapRequestHandler)(user_controller_1.updateMeController));
userRoutes.get('/allmetable-profile', (0, handlers_1.wrapRequestHandler)(user_controller_1.allMeProfileController));
userRoutes.post('/deleteUser', (0, handlers_1.wrapRequestHandler)(user_controller_1.deleteUserController));
userRoutes.get('/search-user', (0, handlers_1.wrapRequestHandler)(user_controller_1.searchUserController));
exports.default = userRoutes;
