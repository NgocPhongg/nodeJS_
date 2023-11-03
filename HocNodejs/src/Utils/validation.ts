import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import HTTP_STATUS from '~/Constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/Models/Errors'

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    //không có lỗi thì next tiếp tục request
    if (errors.isEmpty()) {
      return next()
    }
    const errorsObject = errors.mapped() // nếu muốn hiện thị nhiều lỗi thì đổi thuộc tính đuôi mapped thành gì đó tự tìm
    const entityError = new EntityError({ errors: {} })
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      // trả về lỗi không phải là do lỗi validation
      if (msg instanceof ErrorWithStatus && msg.status != HTTP_STATUS.UNPROCESSABLIE_ENTITY) {
        // errorsObject[key] = errorsObject[key].msg
        return next(msg)
      }
      entityError.errors[key] = errorsObject[key]
    }
    next(entityError)
  }
}

// export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
//   return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     await validation.run(req)
//     const errors = validationResult(req)
//     if (errors.isEmpty()) {
//       return next()
//     }
//     res.status(400).json({ errors: errors.mapped() })
//   }
// }
