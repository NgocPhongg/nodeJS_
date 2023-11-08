"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityError = exports.ErrorWithStatus = void 0;
const httpStatus_1 = __importDefault(require("../Constants/httpStatus"));
const messages_1 = require("../Constants/messages");
class ErrorWithStatus {
    message;
    status;
    constructor({ message, status }) {
        ;
        (this.message = message), (this.status = status);
    }
}
exports.ErrorWithStatus = ErrorWithStatus;
class EntityError extends ErrorWithStatus {
    errors;
    constructor({ message = messages_1.USERS_MESSAGES.VALIDATION_ERROR_COMFIRM_FORMAT, errors }) {
        super({ message, status: httpStatus_1.default.UNAUTHORIZED });
        this.errors = errors;
    }
}
exports.EntityError = EntityError;
// type ErrorType = Record<
//   string,
//   {
//     msg: string
//     [key: string]: any
//   }
// >
// export class ErrorWithStatus {
//   message: string
//   status: number
//   constructor({ message, status }: { message: string; status: number }) {
//     ;(this.message = message), (this.status = status)
//   }
// }
// export class EntityError extends ErrorWithStatus {
//   errors: ErrorType
//   constructor({
//     message = USERS_MESSAGES.VALIDATION_ERROR_COMFIRM_FORMAT,
//     errors
//   }: {
//     message?: string
//     errors: ErrorType
//   }) {
//     super({ message, status: HTTP_STATUS.UNAUTHORIZED })
//     this.errors = errors
//   }
// }
