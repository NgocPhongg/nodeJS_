import User from '~/Models/Schemas/User.schema'
import databaseservice from './database.services'
import { CreateAddress, RegisterReqbody, UpdateMeReqBody } from '~/Models/requests/User.requests'
import { hashPassword } from '~/Utils/crypto'
import { signToken } from '~/Utils/jwt'
import { RoleType, TokenType } from '~/Constants/enums'
import ResFreshToken from '~/Models/Schemas/ReFreshToken.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/Constants/messages'
import HTTP_STATUS from '~/Constants/httpStatus'
import Address from '~/Models/Schemas/Address.schema'
import { v4 as uuidv4 } from 'uuid'
import Role from '~/Models/Schemas/Role.schema'

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccsessToken
      },
      privateKey: process.env.JWT_SECRET_ACCSESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  private signAccsessAndResfreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  async register(payload: RegisterReqbody, payload1?: CreateAddress) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString())
    await databaseservice.address.insertOne(
      new Address({
        ...payload1,
        _id: new ObjectId(),
        user_id: new ObjectId(user_id)
      })
    )
    function getRandomNumber(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    const code = getRandomNumber(1, 1000)
    await databaseservice.users.insertOne(
      new User({
        ...payload,
        code: code.toString(),
        _id: user_id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    // const user_id = result.insertedId.toString()
    const [accsess_token, refresh_token] = await this.signAccsessAndResfreshToken(user_id.toString())
    await databaseservice.reFreshToken.insertOne(
      new ResFreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    await databaseservice.role.insertOne(
      new Role({ user_id: new ObjectId(user_id), _id: new ObjectId(), name: RoleType.Admin })
    )
    console.log('email_verify_token: ', email_verify_token)
    return {
      accsess_token,
      refresh_token
    }
  }
  async checkEmailExsit(email: string) {
    const user = await databaseservice.users.findOne({ email })
    console.log(user)
    return Boolean(user)
  }
  async getMe(user_id: string) {
    const userPromise = await databaseservice.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          date_of_birth: 0,
          verify: 0,
          bio: 0
        }
      }
    )
    // const userPromise = databaseservice.users.findOne({ _id: new ObjectId(user_id), })
    const addressPromise = await databaseservice.address.findOne({ user_id: new ObjectId(user_id) })
    // const [user, address] = await Promise.all([userPromise, addressPromise])
    // return [user, address]
    return { ...userPromise, address: addressPromise }
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

  async login(user_id: string) {
    const [accsess_token, refresh_token] = await this.signAccsessAndResfreshToken(user_id)
    const user = await databaseservice.users.findOne({ _id: new ObjectId(user_id) })
    //console.log(user)
    await databaseservice.reFreshToken.insertOne(
      new ResFreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    return {
      accsess_token,
      refresh_token,
      name: user?.name,
      email: user?.email
    }
  }
  async logout(resfresh_token: string) {
    await databaseservice.reFreshToken.deleteOne({ token: resfresh_token })
    return {
      message: USERS_MESSAGES.VALIDATION_LOGOUT_SECCSESS,
      status: HTTP_STATUS.OK
    }
  }
  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccsessAndResfreshToken(user_id),

      databaseservice.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        {
          $set: {
            email_verify_token: ''
            // updated_at: new Date()
            // updated_at: "$$NOW"// muốn sử dụng đoạn này thì phải đưa vào mảng
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    ])
    const [accsess_token, refresh_token] = token
    return { accsess_token, refresh_token }
  }
  private signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }
  async resendVerifyEmailToken(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken(user_id)
    console.log('Resend verify email')
    //cập nhập lại giá trị email_Verify_token trong user
    await databaseservice.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USERS_MESSAGES.EMAIL_VERIFY_RESEND
    }
  }
  async forgotPassword(user_id: string) {
    const forgot_password_token = await this.signForgotPasswordToken(user_id)
    await databaseservice.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token,
          updated_at: '$$NOW'
        }
      }
    ])
    // gửi email kèm đường link đến email người dùng.
    console.log('forgot_password_token:', forgot_password_token)
    return {
      message: USERS_MESSAGES.CHECK_EMAIL_FORGOT_PASSOWRD
    }
  }
  private signForgotPasswordToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPassWordToken
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    })
  }
  async updateMe(user_id: string, payload: CreateAddress, payloadUser?: UpdateMeReqBody) {
    const userUpdate = await databaseservice.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...(payloadUser && {
            name: payloadUser?.name,
            phone: payloadUser?.phone
          })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    const address = await databaseservice.address.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id)
      },
      {
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
      },
      {
        returnDocument: 'after'
      }
    )
    console.log(userUpdate)
    return {
      name: userUpdate?.name,
      maUser: address?._id,
      phone: address?.phone,
      province: address?.province,
      district: address?.district,
      award: address?.award,
      detail: address?.detail
    }
  }
  private async updateUser(user_id: string, payload: UpdateMeReqBody) {
    const user = await databaseservice.users.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id)
      },
      {
        $set: {
          ...payload
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return user
  }
  async checkRole(role: string) {
    if (role == 'user' || role == 'shop') {
      return true
    }
    return false
  }
  async demoAdress(user_id: string) {
    const address = await databaseservice.address.findOne({ user_id: new ObjectId(user_id) })
    console.log(address)
    return address
  }
  // async checkRole(role: string) {
  //   if (role != 'user' && role != 'shop') {
  //     return true
  //   }
  //   return false
  // }
}

const usersService = new UsersService()
export default usersService

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
