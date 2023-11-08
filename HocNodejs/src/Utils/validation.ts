import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import HTTP_STATUS from '~/Constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/Models/Errors'
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    // Không có lỗi thì next để tiếp tục request
    if (errors.isEmpty()) {
      return next()
    }

    const errorsObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      // Trả về lỗi không phải là do lỗi validation
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLIE_ENTITY) {
        return next(msg)
      }
      entityError.errors.messages = errorsObject[key].msg
    }
    return res.status(HTTP_STATUS.UNPROCESSABLIE_ENTITY).json(entityError.errors)
    // Trả về lỗi validation dưới dạng JSON
    // return res.json({
    //   status: HTTP_STATUS.UNAUTHORIZED,
    //   message: entityError.errors.messages
    // })
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
