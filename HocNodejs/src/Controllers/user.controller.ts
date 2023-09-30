import { Request, Response, NextFunction } from 'express'
import UsersService from '~/Services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqbody } from '~/Models/requests/User.requests'
import usersService from '~/Services/users.services'
import User from '~/Models/Schemas/User.schema'

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as object
  const result = await usersService.login(user_id.toString())
  return res.json({
    message: 'login success',
    result
  })
}
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqbody>, res: Response) => {
  // throw new Error('lỗi test')
  const result = await UsersService.register(req.body)
  return res.json({
    message: 'register success',
    result
  })
}

// export const loginController = (req: Request, res: Response) => {
//   const { email, password } = req.body
//   if (email == 'ngocphong@gmail.com' && password == '123123') {
//     return res.json({
//       message: 'login success'
//     })
//   }
//   return res.status(400).json({
//     error: 'failed'
//   })
// }

// export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqbody>, res: Response) => {
//   // const { email, password } = req.body
//   try {
//     const result = await UsersService.register(req.body)
//     return res.json({
//       message: 'register success',
//       result
//     })
//   } catch (error) {
//     return res.status(400).json({
//       message: 'register failed',
//       error
//     })
//   }
// }
