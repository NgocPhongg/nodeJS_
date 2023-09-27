import User from '~/Models/Schemas/User.schema'
import databaseservice from './database.services'
import { RegisterReqbody } from '~/Models/requests/User.requests'
import { hashPassword } from '~/Utils/crypto'
import { signToken } from '~/Utils/jwt'
import { TokenType } from '~/Constants/enums'
import { promisify } from 'util'

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccsessToken
      },
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
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  async register(payload: RegisterReqbody) {
    const result = await databaseservice.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const user_id = result.insertedId.toString()
    const [accsess_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
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
