import { Request, Response, NextFunction } from 'express'
import UsersService from '~/Services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  LoginReqBody,
  LogoutRequestBody,
  RegisterReqbody,
  TokenPayload,
  EmailVerifyReqBody,
  ForgotPasswordReqBody,
  UpdateMeReqBody,
  CreateAddress,
  DeleteRequestBody,
  SearchRequestBody
} from '~/Models/requests/User.requests'
import usersService from '~/Services/users.services'
import User from '~/Models/Schemas/User.schema'
import databaseservice from '~/Services/database.services'
import HTTP_STATUS from '~/Constants/httpStatus'
import { USERS_MESSAGES } from '~/Constants/messages'
import { UserVerifyStatus } from '~/Constants/enums'
import { ObjectId } from 'mongodb'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as object
  const data = await usersService.login(user_id.toString())
  return res.json({
    status: HTTP_STATUS.OK,
    message: USERS_MESSAGES.VALIDATION_SECCSESS,
    data
  })
}
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqbody>, res: Response) => {
  const data = await UsersService.register(req.body)
  return res.json({
    status: HTTP_STATUS.OK,
    message: USERS_MESSAGES.VALIDATION_SECCSESS_REGISTER,
    data
  })
}
export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.json(result)
}
export const deleteUserController = async (req: Request<ParamsDictionary, any, DeleteRequestBody>, res: Response) => {
  const { _id } = req.body
  const result = await usersService.deleteUser(_id)
  console.log(res)
  return res.json(result)
}
export const emailVerifyController = async (
  req: Request<ParamsDictionary, any, EmailVerifyReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decode_email_verify_token as TokenPayload
  const user = await databaseservice.users.findOne({ _id: new Object(user_id) })
  // nếu không tìm thiếu user sẽ báo lỗi
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.VALIDATION_EMAIL_NOT_FOUND
    })
  }
  // đã verify rồi sẽ không báo lỗi
  // mà mình sẽ trả về status ok với message là đã verify trước đó rồi
  if (user.email_verify_token == '') {
    return res.json({
      message: USERS_MESSAGES.VALIDATION_EMAIL_ALREADY_VERIFY
    })
  }
  const result = await usersService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCSSES,
    result
  })
}
export const resendEmailVerifyController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const user = await databaseservice.users.findOne({ _id: new Object(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.verify == UserVerifyStatus.Unverified) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: USERS_MESSAGES.USER_HAVE_VERIFY
    })
  }
  const data = await usersService.resendVerifyEmailToken(user_id)
  return res.json(data)
}
export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  const { _id } = req.user as User
  const data = await usersService.forgotPassword((_id as ObjectId).toString())
  return res.json({
    data
  })
}
// sử dụng http get
export const meProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const data = await usersService.getMe(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCSES,
    status: HTTP_STATUS.OK,
    data
  })
}
export const allMeProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const data = await usersService.allMeTable()
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCSES,
    status: HTTP_STATUS.OK,
    data
  })
}
export const updateMeController = async (
  req: Request<ParamsDictionary, any, CreateAddress, UpdateMeReqBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const user = await usersService.updateMe(user_id, req.body, req.body as UpdateMeReqBody)
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCSES,
    status: HTTP_STATUS.OK,
    user
  })
}
export const searchUserController = async (req: Request<ParamsDictionary, any, SearchRequestBody>, res: Response) => {
  const payload: SearchRequestBody = req.body
  const data = await usersService.searchUser(payload)
  return res.json({
    status: HTTP_STATUS.OK,
    data
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
// export const loginController = async (req: Request, res: Response) => {
//   const user = req.body
//   const data = await usersService.login(req.body?.email || '')
//   return res.json({
//     status: HTTP_STATUS.OK,
//     message: USERS_MESSAGES.VALIDATION_SECCSESS,
//     data
//   })
// }
