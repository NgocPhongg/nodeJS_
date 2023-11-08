import { JwtPayload } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { TokenType } from '~/Constants/enums'
export interface LoginReqBody {
  email: string
  password: string
}
// req create user
export interface RegisterReqbody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
  code: number
  role: string
}
export interface LogoutRequestBody {
  refresh_token: string
}
export interface DeleteRequestBody {
  _id: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}
export interface EmailVerifyReqBody {
  email_verify_token: string
}
export interface ForgotPasswordReqBody {
  email: string
}
export interface SearchRequestBody {
  name: string
  award: string
}
// export interface UpdateAdressReqBody {
//   province?: string
//   district?: string
//   award?: string
//   detail?: string
//   phone?: string
//   user_id: ObjectId
// }
export interface UpdateMeReqBody {
  name?: string
  phone?: string
  avatar?: string
}
export interface CreateAddress {
  _id: ObjectId
  province?: string
  district?: string
  award?: string
  detail?: string
  user_id: ObjectId
}
