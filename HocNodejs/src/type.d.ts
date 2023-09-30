import User from './Models/Schemas/User.schema'
import { Request } from 'express'
declare module 'express' {
  interface Request {
    user?: User
  }
}
