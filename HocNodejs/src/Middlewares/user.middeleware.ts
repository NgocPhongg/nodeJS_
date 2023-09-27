import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import usersService from '~/Services/users.services'
import { validate } from '~/Utils/validation'
export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      error: 'missing email or password'
    })
  }
  next()
}

export const registerVadidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      },
      trim: true
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value) => {
          const isResult = await usersService.checkEmailExsit(value)
          if (isResult) {
            throw new Error('email đã tồn tại ')
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
        }
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: 'file password'
      }
    },
    comfrim_password: {
      notEmpty: true,
      isString: true,
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
      custom: {
        options: (value, { req }) => {
          if (value != req.body.password) {
            throw new Error('password của bạn không chính xác')
          }
          return true
        }
      }
    },
    data_of_birth: {
      // isISO8601: {
      //   options: {
      //     strict: true,
      //     strictSeparator: true
      //   },
      //   errorMessage: 'lỗi Định Dạng'
      // }
    }
  })
)
