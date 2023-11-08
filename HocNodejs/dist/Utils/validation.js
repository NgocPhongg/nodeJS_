"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const httpStatus_1 = __importDefault(require("../Constants/httpStatus"));
const Errors_1 = require("../Models/Errors");
const validate = (validation) => {
    return async (req, res, next) => {
        await validation.run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        // Không có lỗi thì next để tiếp tục request
        if (errors.isEmpty()) {
            return next();
        }
        const errorsObject = errors.mapped();
        const entityError = new Errors_1.EntityError({ errors: {} });
        for (const key in errorsObject) {
            const { msg } = errorsObject[key];
            // Trả về lỗi không phải là do lỗi validation
            if (msg instanceof Errors_1.ErrorWithStatus && msg.status !== httpStatus_1.default.UNPROCESSABLIE_ENTITY) {
                return next(msg);
            }
            entityError.errors.messages = errorsObject[key].msg;
        }
        // return res.status(HTTP_STATUS.UNPROCESSABLIE_ENTITY).json(entityError.errors)
        // Trả về lỗi validation dưới dạng JSON
        return res.json({
            status: httpStatus_1.default.UNAUTHORIZED,
            message: entityError.errors.messages
        });
    };
};
exports.validate = validate;
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
