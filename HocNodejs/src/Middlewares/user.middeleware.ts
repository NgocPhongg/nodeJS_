import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { isLength } from 'lodash'
import { json } from 'stream/consumers'
import HTTP_STATUS from '~/Constants/httpStatus'
import { USERS_MESSAGES } from '~/Constants/messages'
import { ErrorWithStatus } from '~/Models/Errors'
import databaseservice from '~/Services/database.services'
import usersService from '~/Services/users.services'
import { hashPassword } from '~/Utils/crypto'
import { verifyToken } from '~/Utils/jwt'
import { validate } from '~/Utils/validation'
export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: true,
        isEmail: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseservice.users.findOne({
              email: value
              // password: hashPassword(req.body.password)
            })
            if (user == null) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.VALIDATION_EMAIL_EXIT,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: true,
        isString: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseservice.users.findOne({
              password: hashPassword(req.body.password)
            })
            if (!user) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.VALIDATION_ERROR_PASSWORD,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            req.user = user
            return true
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
    },
    ['body']
  )
)
export const registerVadidator = validate(
  checkSchema(
    {
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
            const isResult = await usersService.checkEmailExsit(value)
            if (isResult) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.VALIDATION_ERROR_EMAIL,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
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
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.VALIDATION_ERROR_COMFIRM_PASSWORD,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
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
    },
    ['body']
  )
)
export const accsessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const accsess_token = (value || '').split(' ')[1]
            if (!accsess_token) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.VALIDATION_REFRESH_TOKEN,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decode_authorization = await verifyToken({
                token: accsess_token,
                secretOrPublicKey: process.env.JWT_SECRET_ACCSESS_TOKEN as string
              })
              ;(req as Request).decode_authorization = decode_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: (error as JsonWebTokenError).message,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.VALIDATION_REFRESH_TOKEN,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const [decode_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
                databaseservice.reFreshToken.findOne({ token: value })
              ])
              if (refresh_token == null) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.VALIDATION_ERROR_REFRESHTOKEN,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decode_refresh_token = decode_refresh_token
            } catch (error) {
              if (error) {
                throw new ErrorWithStatus({
                  message: (error as JsonWebTokenError).message,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
            }
            // const decode_resfresh_token = await verifyToken({ token: value })
            // console.log(decode_resfresh_token)
            return true
          }
        }
      }
    },
    ['body']
  )
)
export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.VALIDATION_ERROR_EMAIL_VERIFY_TOKEN,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const decode_email_verify_token = await verifyToken({
              token: value,
              secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
            })

            ;(req as Request).decode_email_verify_token = decode_email_verify_token
            return true
          }
        }
      }
    },
    ['body']
  )
)
export const forgotPassWordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: true,
        isEmail: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseservice.users.findOne({
              email: value
            })
            if (user == null) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.VALIDATION_EMAIL_EXIT,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)
export const updateAdressValidator = validate(
  checkSchema(
    {
      name: {
        // notEmpty: true,
        // isString: true,
        isLength: {
          options: {
            min: 2,
            max: 50
          }
        },
        errorMessage: USERS_MESSAGES.VALIDATION_ERROR_NAME_USER,
        trim: true
      },
      province: {
        // notEmpty: true,
        // isString: true,
        isLength: {
          options: {
            min: 0,
            max: 50
          }
        },
        errorMessage: 'Lỗi độ dài hoặc không hợp lệ của provice',
        trim: true
      },
      district: {
        // notEmpty: true,
        // isString: true,
        isLength: {
          options: {
            min: 0,
            max: 50
          }
        },
        errorMessage: 'Lỗi độ dài hoặc không hợp lệ của district',
        trim: true
      },
      award: {
        // notEmpty: true,
        // isString: true,
        isLength: {
          options: {
            min: 0,
            max: 50
          }
        },
        errorMessage: 'Lỗi độ dài hoặc không hợp lệ của award',
        trim: true
      },
      detail: {
        // notEmpty: true,
        // isString: true,
        isLength: {
          options: {
            min: 0,
            max: 50
          }
        },
        errorMessage: 'Lỗi độ dài hoặc không hợp lệ của detail',
        trim: true
      }
    },
    ['body']
  )
)
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
