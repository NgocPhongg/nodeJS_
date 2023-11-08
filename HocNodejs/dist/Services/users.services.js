"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_schema_1 = __importDefault(require("../Models/Schemas/User.schema"));
const database_services_1 = __importDefault(require("./database.services"));
const crypto_1 = require("../Utils/crypto");
const jwt_1 = require("../Utils/jwt");
const enums_1 = require("../Constants/enums");
const ReFreshToken_schema_1 = __importDefault(require("../Models/Schemas/ReFreshToken.schema"));
const mongodb_1 = require("mongodb");
const messages_1 = require("../Constants/messages");
const httpStatus_1 = __importDefault(require("../Constants/httpStatus"));
const Address_schema_1 = __importDefault(require("../Models/Schemas/Address.schema"));
class UsersService {
    signAccessToken(user_id) {
        return (0, jwt_1.signToken)({
            payload: {
                user_id,
                token_type: enums_1.TokenType.AccsessToken
            },
            privateKey: process.env.JWT_SECRET_ACCSESS_TOKEN,
            options: {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
            }
        });
    }
    signRefreshToken(user_id) {
        return (0, jwt_1.signToken)({
            payload: {
                user_id,
                token_type: enums_1.TokenType.RefreshToken
            },
            privateKey: process.env.JWT_SECRET_REFRESH_TOKEN,
            options: {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
            }
        });
    }
    signAccsessAndResfreshToken(user_id) {
        return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)]);
    }
    async register(payload, payload1) {
        const user_id = new mongodb_1.ObjectId();
        const email_verify_token = await this.signEmailVerifyToken(user_id.toString());
        await database_services_1.default.address.insertOne(new Address_schema_1.default({
            ...payload1,
            _id: new mongodb_1.ObjectId(),
            user_id: new mongodb_1.ObjectId(user_id)
        }));
        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        const code = getRandomNumber(1, 1000);
        await database_services_1.default.users.insertOne(new User_schema_1.default({
            ...payload,
            code: code.toString(),
            _id: user_id,
            email_verify_token,
            date_of_birth: new Date(payload.date_of_birth),
            password: (0, crypto_1.hashPassword)(payload.password),
            role: enums_1.RoleType.customr
        }));
        // const user_id = result.insertedId.toString()
        const [accsess_token, refresh_token] = await this.signAccsessAndResfreshToken(user_id.toString());
        await database_services_1.default.reFreshToken.insertOne(new ReFreshToken_schema_1.default({ user_id: new mongodb_1.ObjectId(user_id), token: refresh_token }));
        // await databaseservice.role.insertOne(new Role({ _id_role: new ObjectId(), name: RoleType.Admin }))
        console.log('email_verify_token: ', email_verify_token);
        return {
            accsess_token,
            refresh_token
        };
    }
    async checkEmailExsit(email) {
        const user = await database_services_1.default.users.findOne({ email });
        console.log(user);
        return Boolean(user);
    }
    async getMe(user_id) {
        const userPromise = await database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(user_id) }, {
            projection: {
                password: 0,
                email_verify_token: 0,
                forgot_password_token: 0,
                date_of_birth: 0,
                verify: 0,
                bio: 0
            }
        });
        // const userPromise = databaseservice.users.findOne({ _id: new ObjectId(user_id), })
        const addressPromise = await database_services_1.default.address.findOne({ user_id: new mongodb_1.ObjectId(user_id) });
        // const [user, address] = await Promise.all([userPromise, addressPromise])
        // return [user, address]
        return { ...userPromise, address: addressPromise };
    }
    async allMeTable() {
        const userPromise = await database_services_1.default.users
            .find({}, {
            projection: {
                password: 0,
                email_verify_token: 0,
                forgot_password_token: 0,
                date_of_birth: 0,
                verify: 0,
                bio: 0
            }
        })
            .toArray();
        if (userPromise.length === 0) {
            return 'Không có dữ liệu người dùng';
        }
        return [...userPromise];
    }
    async deleteUser(user_id) {
        const deletedUser = await database_services_1.default.users.findOneAndDelete({ _id: new mongodb_1.ObjectId(user_id) });
        await database_services_1.default.reFreshToken.deleteMany({ user_id: new mongodb_1.ObjectId(user_id) });
        if (deletedUser) {
            return {
                message: 'Xóa thông tin user thành công',
                status: httpStatus_1.default.OK
            };
        }
        else {
            return {
                message: 'Không tìm thấy người dùng',
                status: httpStatus_1.default.NOT_FOUND
            };
        }
    }
    // async getMe(user_id: string) {
    //   const user = await databaseservice.users
    //     .aggregate([
    //       { $match: { _id: new ObjectId(user_id) } },
    //       {
    //         $lookup: {
    //           from: 'address',
    //           localField: '_id',
    //           foreignField: 'user_id',
    //           as: 'address'
    //         }
    //       },
    //       {
    //         $project: {
    //           password: 0,
    //           email_verify_token: 0,
    //           forgot_password_token: 0,
    //           date_of_birth: 0,
    //           verify: 0,
    //           bio: 0,
    //           'address.user_id': 0
    //         }
    //       }
    //     ])
    //     .next()
    //   console.log(user)
    //   return user
    // }
    async login(user_id) {
        const [accsess_token, refresh_token] = await this.signAccsessAndResfreshToken(user_id);
        const user = await database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(user_id) });
        console.log(user);
        await database_services_1.default.reFreshToken.insertOne(new ReFreshToken_schema_1.default({ user_id: new mongodb_1.ObjectId(user_id), token: refresh_token }));
        return {
            accsess_token,
            refresh_token,
            _id: user?._id,
            name: user?.name,
            email: user?.email
        };
    }
    async logout(resfresh_token) {
        await database_services_1.default.reFreshToken.deleteOne({ token: resfresh_token });
        return {
            message: messages_1.USERS_MESSAGES.VALIDATION_LOGOUT_SECCSESS,
            status: httpStatus_1.default.OK
        };
    }
    async verifyEmail(user_id) {
        const [token] = await Promise.all([
            this.signAccsessAndResfreshToken(user_id),
            database_services_1.default.users.updateOne({
                _id: new mongodb_1.ObjectId(user_id)
            }, {
                $set: {
                    email_verify_token: ''
                    // updated_at: new Date()
                    // updated_at: "$$NOW"// muốn sử dụng đoạn này thì phải đưa vào mảng
                },
                $currentDate: {
                    updated_at: true
                }
            })
        ]);
        const [accsess_token, refresh_token] = token;
        return { accsess_token, refresh_token };
    }
    signEmailVerifyToken(user_id) {
        return (0, jwt_1.signToken)({
            payload: {
                user_id,
                token_type: enums_1.TokenType.EmailVerifyToken
            },
            privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN,
            options: {
                expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
            }
        });
    }
    async resendVerifyEmailToken(user_id) {
        const email_verify_token = await this.signEmailVerifyToken(user_id);
        console.log('Resend verify email');
        //cập nhập lại giá trị email_Verify_token trong user
        await database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, {
            $set: {
                email_verify_token
            },
            $currentDate: {
                updated_at: true
            }
        });
        return {
            message: messages_1.USERS_MESSAGES.EMAIL_VERIFY_RESEND
        };
    }
    async forgotPassword(user_id) {
        const forgot_password_token = await this.signForgotPasswordToken(user_id);
        await database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, [
            {
                $set: {
                    forgot_password_token,
                    updated_at: '$$NOW'
                }
            }
        ]);
        // gửi email kèm đường link đến email người dùng.
        console.log('forgot_password_token:', forgot_password_token);
        return {
            message: messages_1.USERS_MESSAGES.CHECK_EMAIL_FORGOT_PASSOWRD
        };
    }
    signForgotPasswordToken(user_id) {
        return (0, jwt_1.signToken)({
            payload: {
                user_id,
                token_type: enums_1.TokenType.ForgotPassWordToken
            },
            privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
            options: {
                expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
            }
        });
    }
    async updateMe(user_id, payload, payloadUser) {
        const userUpdate = await database_services_1.default.users.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(user_id)
        }, {
            $set: {
                ...(payloadUser && {
                    name: payloadUser?.name,
                    phone: payloadUser?.phone
                })
            },
            $currentDate: {
                updated_at: true
            }
        }, {
            returnDocument: 'after'
        });
        const address = await database_services_1.default.address.findOneAndUpdate({
            user_id: new mongodb_1.ObjectId(user_id)
        }, {
            $set: {
                ...(payload && {
                    province: payload?.province,
                    district: payload?.district,
                    award: payload?.award,
                    detail: payload?.detail
                })
            },
            $currentDate: {
                updated_at: true
            }
        }, {
            returnDocument: 'after'
        });
        return {
            name: userUpdate?.name,
            maUser: address?._id,
            province: address?.province,
            district: address?.district,
            award: address?.award,
            detail: address?.detail
        };
    }
    // private async updateUser(user_id: string, payload: UpdateMeReqBody) {
    //   const user = await databaseservice.users.findOneAndUpdate(
    //     {
    //       user_id: new ObjectId(user_id)
    //     },
    //     {
    //       $set: {
    //         ...payload
    //       },
    //       $currentDate: {
    //         updated_at: true
    //       }
    //     },
    //     {
    //       returnDocument: 'after'
    //     }
    //   )
    //   return user
    // }
    async checkRole(role) {
        if (role == 'user' || role == 'shop') {
            return true;
        }
        return false;
    }
    async demoAdress(user_id) {
        const address = await database_services_1.default.address.findOne({ user_id: new mongodb_1.ObjectId(user_id) });
        console.log(address);
        return address;
    }
    async searchUser(payload, user_id) {
        const firstLetter = payload.name.charAt(0); // Lấy chữ cái đầu tiên
        const regexPattern = `^${firstLetter}.+`; // Tạo mẫu biểu thức chính quy
        const regex = new RegExp(regexPattern, 'i');
        const searchResults = await database_services_1.default.users
            .aggregate([
            { $match: { $text: { $search: payload.name } } },
            {
                $lookup: {
                    from: 'address',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'address'
                }
            },
            {
                $unwind: {
                    path: '$address',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_password_token: 0,
                    date_of_birth: 0,
                    verify: 0,
                    bio: 0,
                    'address.user_id': 0
                }
            }
            // {
            //   $group: {
            //     _id: '$_id',
            //     name: { $first: '$name' },
            //     email: { $first: '$email' },
            //     created_at: { $first: '$created_at' },
            //     updated_at: { $first: '$updated_at' },
            //     avatar: { $first: '$avatar' },
            //     cover_photo: { $first: '$cover_photo' },
            //     code: { $first: '$code' },
            //     phone: { $first: '$phone' },
            //     role: { $first: '$role' },
            //     address: { $first: '$address' }
            //   }
            // }
        ])
            .toArray();
        if (searchResults.length === 0) {
            return 'không tìm thấy user';
        }
        return searchResults;
    }
}
const usersService = new UsersService();
exports.default = usersService;
// class UsersService {
//   async register(payload: { email: string; password: string }) {
//     const { email, password } = payload
//     const result = await databaseservice.users.insertOne(
//       new User({
//         email,
//         password
//       })
//     )
//     return result
//   }
//   async checkEmailExsit(email: string) {
//     const user = await databaseservice.users.findOne({ email })
//     console.log(user)
//     return Boolean(user)
//   }
// }
// const usersService = new UsersService()
// export default usersService
// async register(payload: RegisterReqbody) {
//   const result = await databaseservice.users.insertOne(
//     new User({
//       ...payload,
//       date_of_birth: new Date(payload.date_of_birth),
//       password: hashPassword(payload.password)
//     })
//   )
//   const user_id = result.insertedId.toString()
//   const [accsess_token, refresh_token] = await Promise.all([
//     this.signAccessToken(user_id),
//     this.signRefreshToken(user_id)
//   ])
//   return {
//     accsess_token,
//     refresh_token
//   }
// }
