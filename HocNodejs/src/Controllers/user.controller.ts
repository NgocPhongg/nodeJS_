import { Request, Response, NextFunction } from 'express'
import User from '~/Models/Schemas/User.schema'
import databaseservice from '~/Services/database.services'
import UsersService from '~/Services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqbody } from '~/Models/requests/User.requests'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email == 'duthanhduoc@gmail.com' && password == '123123') {
    return res.json({
      message: 'login success'
    })
  }
  return res.status(400).json({
    error: 'failed'
  })
}
// ReqBody = any
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqbody>, res: Response) => {
  // const { email, password } = req.body
  try {
    const result = await UsersService.register(req.body)
    return res.json({
      message: 'register success',
      result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'register failed',
      error
    })
  }
}
