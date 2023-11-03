import User from './Models/Schemas/User.schema'
import { Request } from 'express'
import { TokenPayload } from './Models/requests/User.requests'
declare module 'express' {
  interface Request {
    user?: User
    decode_authorization?: TokenPayload
    decode_refresh_token?: TokenPayload
    decode_email_verify_token?: TokenPayload
  }
}
