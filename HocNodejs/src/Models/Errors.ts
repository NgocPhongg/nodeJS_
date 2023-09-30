import HTTP_STATUS from '~/Constants/httpStatus'
import { USERS_MESSAGES } from '~/Constants/messages'

type ErrorType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>
export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    ;(this.message = message), (this.status = status)
  }
}
export class EntityError extends ErrorWithStatus {
  errors: ErrorType
  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLIE_ENTITY })
    this.errors = errors
  }
}
