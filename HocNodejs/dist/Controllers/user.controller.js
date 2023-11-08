"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUserController = exports.updateMeController = exports.allMeProfileController = exports.meProfileController = exports.forgotPasswordController = exports.resendEmailVerifyController = exports.emailVerifyController = exports.deleteUserController = exports.logoutController = exports.registerController = exports.loginController = void 0;
const users_services_1 = __importDefault(require("../Services/users.services"));
const users_services_2 = __importDefault(require("../Services/users.services"));
const database_services_1 = __importDefault(require("../Services/database.services"));
const httpStatus_1 = __importDefault(require("../Constants/httpStatus"));
const messages_1 = require("../Constants/messages");
const enums_1 = require("../Constants/enums");
const loginController = async (req, res) => {
    const user = req.user;
    const user_id = user._id;
    const data = await users_services_2.default.login(user_id.toString());
    return res.json({
        status: httpStatus_1.default.OK,
        message: messages_1.USERS_MESSAGES.VALIDATION_SECCSESS,
        data
    });
};
exports.loginController = loginController;
const registerController = async (req, res) => {
    const data = await users_services_1.default.register(req.body);
    return res.json({
        status: httpStatus_1.default.OK,
        message: messages_1.USERS_MESSAGES.VALIDATION_SECCSESS_REGISTER,
        data
    });
};
exports.registerController = registerController;
const logoutController = async (req, res) => {
    const { refresh_token } = req.body;
    const result = await users_services_2.default.logout(refresh_token);
    return res.json(result);
};
exports.logoutController = logoutController;
const deleteUserController = async (req, res) => {
    const { _id } = req.body;
    const result = await users_services_2.default.deleteUser(_id);
    return res.json(result);
};
exports.deleteUserController = deleteUserController;
const emailVerifyController = async (req, res, next) => {
    const { user_id } = req.decode_email_verify_token;
    const user = await database_services_1.default.users.findOne({ _id: new Object(user_id) });
    // nếu không tìm thiếu user sẽ báo lỗi
    if (!user) {
        return res.status(httpStatus_1.default.NOT_FOUND).json({
            message: messages_1.USERS_MESSAGES.VALIDATION_EMAIL_NOT_FOUND
        });
    }
    // đã verify rồi sẽ không báo lỗi
    // mà mình sẽ trả về status ok với message là đã verify trước đó rồi
    if (user.email_verify_token == '') {
        return res.json({
            message: messages_1.USERS_MESSAGES.VALIDATION_EMAIL_ALREADY_VERIFY
        });
    }
    const result = await users_services_2.default.verifyEmail(user_id);
    return res.json({
        message: messages_1.USERS_MESSAGES.EMAIL_VERIFY_SUCSSES,
        result
    });
};
exports.emailVerifyController = emailVerifyController;
const resendEmailVerifyController = async (req, res, next) => {
    const { user_id } = req.decode_authorization;
    const user = await database_services_1.default.users.findOne({ _id: new Object(user_id) });
    if (!user) {
        return res.status(httpStatus_1.default.NOT_FOUND).json({
            message: messages_1.USERS_MESSAGES.USER_NOT_FOUND
        });
    }
    if (user.verify == enums_1.UserVerifyStatus.Unverified) {
        return res.status(httpStatus_1.default.UNAUTHORIZED).json({
            message: messages_1.USERS_MESSAGES.USER_HAVE_VERIFY
        });
    }
    const data = await users_services_2.default.resendVerifyEmailToken(user_id);
    return res.json(data);
};
exports.resendEmailVerifyController = resendEmailVerifyController;
const forgotPasswordController = async (req, res) => {
    const { _id } = req.user;
    const data = await users_services_2.default.forgotPassword(_id.toString());
    return res.json({
        data
    });
};
exports.forgotPasswordController = forgotPasswordController;
// sử dụng http get
const meProfileController = async (req, res, next) => {
    const { user_id } = req.decode_authorization;
    const data = await users_services_2.default.getMe(user_id);
    return res.json({
        message: messages_1.USERS_MESSAGES.GET_ME_SUCCSES,
        status: httpStatus_1.default.OK,
        data
    });
};
exports.meProfileController = meProfileController;
const allMeProfileController = async (req, res, next) => {
    const data = await users_services_2.default.allMeTable();
    return res.json({
        message: messages_1.USERS_MESSAGES.GET_ME_SUCCSES,
        status: httpStatus_1.default.OK,
        data
    });
};
exports.allMeProfileController = allMeProfileController;
const updateMeController = async (req, res) => {
    const { user_id } = req.decode_authorization;
    const user = await users_services_2.default.updateMe(user_id, req.body, req.body);
    return res.json({
        message: messages_1.USERS_MESSAGES.UPDATE_ME_SUCCSES,
        status: httpStatus_1.default.OK,
        user
    });
};
exports.updateMeController = updateMeController;
const searchUserController = async (req, res) => {
    const payload = req.body;
    const user = await users_services_2.default.searchUser(payload);
    return res.json({
        status: httpStatus_1.default.OK,
        user
    });
};
exports.searchUserController = searchUserController;
// export const loginController = (req: Request, res: Response) => {
//   const { email, password } = req.body
//   if (email == 'ngocphong@gmail.com' && password == '123123') {
//     return res.json({
//       message: 'login success'
//     })
//   }
//   return res.status(400).json({
//     error: 'failed'
//   })
// }
// export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqbody>, res: Response) => {
//   // const { email, password } = req.body
//   try {
//     const result = await UsersService.register(req.body)
//     return res.json({
//       message: 'register success',
//       result
//     })
//   } catch (error) {
//     return res.status(400).json({
//       message: 'register failed',
//       error
//     })
//   }
// }
// export const loginController = async (req: Request, res: Response) => {
//   const user = req.body
//   const data = await usersService.login(req.body?.email || '')
//   return res.json({
//     status: HTTP_STATUS.OK,
//     message: USERS_MESSAGES.VALIDATION_SECCSESS,
//     data
//   })
// }
