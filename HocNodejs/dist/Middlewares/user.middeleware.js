"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdressValidator = exports.forgotPassWordValidator = exports.emailVerifyTokenValidator = exports.refreshTokenValidator = exports.accsessTokenValidator = exports.registerVadidator = exports.loginValidator = void 0;
const express_validator_1 = require("express-validator");
const httpStatus_1 = __importDefault(require("../Constants/httpStatus"));
const messages_1 = require("../Constants/messages");
const Errors_1 = require("../Models/Errors");
const database_services_1 = __importDefault(require("../Services/database.services"));
const users_services_1 = __importDefault(require("../Services/users.services"));
const crypto_1 = require("../Utils/crypto");
const jwt_1 = require("../Utils/jwt");
const validation_1 = require("../Utils/validation");
exports.loginValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    email: {
        notEmpty: true,
        isEmail: true,
        trim: true,
        custom: {
            options: async (value, { req }) => {
                const user = await database_services_1.default.users.findOne({
                    email: value
                    // password: hashPassword(req.body.password)
                });
                if (user == null) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.VALIDATION_EMAIL_EXIT,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                req.user = user;
                return true;
            }
        }
    },
    password: {
        notEmpty: true,
        isString: true,
        custom: {
            options: async (value, { req }) => {
                const user = await database_services_1.default.users.findOne({
                    password: (0, crypto_1.hashPassword)(req.body.password)
                });
                if (!user) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.VALIDATION_ERROR_PASSWORD,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                req.user = user;
                return true;
            }
        },
        isLength: {
            options: {
                min: 6,
                max: 50
            }
        },
        isStrongPassword: {
            options: {
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            }
        },
        errorMessage: 'Bạn chưa nhập password'
    }
}, ['body']));
exports.registerVadidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    name: {
        notEmpty: true,
        isString: true,
        isLength: {
            options: {
                min: 2,
                max: 100
            }
        },
        errorMessage: 'Lỗi chiều dài name bắt buộc 2-50 ký tự'
    },
    email: {
        notEmpty: true,
        isEmail: true,
        trim: true,
        custom: {
            options: async (value, { req }) => {
                const isResult = await users_services_1.default.checkEmailExsit(value);
                if (isResult) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.VALIDATION_ERROR_EMAIL,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                return true;
            }
        }
    },
    password: {
        notEmpty: true,
        isString: true,
        isLength: {
            options: {
                min: 6,
                max: 50
            },
            errorMessage: 'Lỗi độ dài password phải từ 6-50 ký tự'
        },
        isStrongPassword: {
            options: {
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            },
            errorMessage: 'lỗi định dạng password thiếu ký tự in hoa, số và ký tự đặc biệt'
        }
    },
    confirm_password: {
        notEmpty: true,
        isString: true,
        isLength: {
            options: {
                min: 6,
                max: 50
            },
            errorMessage: 'Lỗi độ dài password phải từ 6-50 ký tự'
        },
        isStrongPassword: {
            options: {
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            },
            errorMessage: 'lỗi định dạng password thiếu ký tự in hoa, số và ký tự đặc biệt'
        },
        custom: {
            options: (value, { req }) => {
                if (value != req.body.password) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.VALIDATION_ERROR_COMFIRM_PASSWORD,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                return true;
            }
        }
    }
    // role: {
    //   notEmpty: true,
    //   trim: true,
    //   custom: {
    //     options: async (value) => {
    //       const isResult = await usersService.checkRole(value)
    //       if (isResult) {
    //         return true
    //       } else {
    //         throw new ErrorWithStatus({
    //           message: USERS_MESSAGES.VALIDATION_ERROR_ROLE,
    //           status: HTTP_STATUS.UNAUTHORIZED
    //         })
    //       }
    //     }
    //   }
    // }
    // data_of_birth: {
    //   isISO8601: {
    //     options: {
    //       strict: true,
    //       strictSeparator: true
    //     },
    //     errorMessage: 'lỗi Định Dạng'
    //   }
    // }
}, ['body']));
exports.accsessTokenValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    Authorization: {
        custom: {
            options: async (value, { req }) => {
                const accsess_token = (value || '').split(' ')[1];
                if (!accsess_token) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.VALIDATION_REFRESH_TOKEN,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                try {
                    const decode_authorization = await (0, jwt_1.verifyToken)({
                        token: accsess_token,
                        secretOrPublicKey: process.env.JWT_SECRET_ACCSESS_TOKEN
                    });
                    req.decode_authorization = decode_authorization;
                }
                catch (error) {
                    throw new Errors_1.ErrorWithStatus({
                        message: error.message,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                return true;
            }
        }
    }
}, ['headers']));
exports.refreshTokenValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    refresh_token: {
        trim: true,
        custom: {
            options: async (value, { req }) => {
                if (!value) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.VALIDATION_REFRESH_TOKEN,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                try {
                    const [decode_refresh_token, refresh_token] = await Promise.all([
                        (0, jwt_1.verifyToken)({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN }),
                        database_services_1.default.reFreshToken.findOne({ token: value })
                    ]);
                    if (refresh_token == null) {
                        throw new Errors_1.ErrorWithStatus({
                            message: messages_1.USERS_MESSAGES.VALIDATION_ERROR_REFRESHTOKEN,
                            status: httpStatus_1.default.UNAUTHORIZED
                        });
                    }
                    ;
                    req.decode_refresh_token = decode_refresh_token;
                }
                catch (error) {
                    if (error) {
                        throw new Errors_1.ErrorWithStatus({
                            message: error.message,
                            status: httpStatus_1.default.UNAUTHORIZED
                        });
                    }
                    throw error;
                }
                // const decode_resfresh_token = await verifyToken({ token: value })
                // console.log(decode_resfresh_token)
                return true;
            }
        }
    }
}, ['body']));
exports.emailVerifyTokenValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    email_verify_token: {
        trim: true,
        custom: {
            options: async (value, { req }) => {
                if (!value) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.VALIDATION_ERROR_EMAIL_VERIFY_TOKEN,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                const decode_email_verify_token = await (0, jwt_1.verifyToken)({
                    token: value,
                    secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN
                });
                req.decode_email_verify_token = decode_email_verify_token;
                return true;
            }
        }
    }
}, ['body']));
exports.forgotPassWordValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    email: {
        notEmpty: true,
        isEmail: true,
        trim: true,
        custom: {
            options: async (value, { req }) => {
                const user = await database_services_1.default.users.findOne({
                    email: value
                });
                if (user == null) {
                    throw new Errors_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.VALIDATION_EMAIL_EXIT,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                req.user = user;
                return true;
            }
        }
    }
}, ['body']));
exports.updateAdressValidator = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
// name: {
//   // notEmpty: true,
//   // isString: true,
//   isLength: {
//     options: {
//       min: 2,
//       max: 50
//     }
//   },
//   errorMessage: USERS_MESSAGES.VALIDATION_ERROR_NAME_USER,
//   trim: true
// },
// province: {
//   // notEmpty: true,
//   // isString: true,
//   isLength: {
//     options: {
//       min: 0,
//       max: 50
//     }
//   },
//   errorMessage: 'Lỗi độ dài hoặc không hợp lệ của provice',
//   trim: true
// },
// district: {
//   // notEmpty: true,
//   // isString: true,
//   isLength: {
//     options: {
//       min: 0,
//       max: 50
//     }
//   },
//   errorMessage: 'Lỗi độ dài hoặc không hợp lệ của district',
//   trim: true
// },
// award: {
//   // notEmpty: true,
//   // isString: true,
//   isLength: {
//     options: {
//       min: 0,
//       max: 50
//     }
//   },
//   errorMessage: 'Lỗi độ dài hoặc không hợp lệ của award',
//   trim: true
// },
// detail: {
//   // notEmpty: true,
//   // isString: true,
//   isLength: {
//     options: {
//       min: 0,
//       max: 50
//     }
//   },
//   errorMessage: 'Lỗi độ dài hoặc không hợp lệ của detail',
//   trim: true
// }
}, ['body']));
// export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
//   const { email, password } = req.body
//   if (!email || !password) {
//     return res.status(400).json({
//       error: 'missing email or password'
//     })
//   }
//   next()
// }
// test lỗi
// if (user == null) {
//   const errorResponse = {
//     error: 'Email user not found'
//   }
//   return req.res.status(400).json(errorResponse)
// }
