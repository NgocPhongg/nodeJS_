"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultErrorHandler = void 0;
const lodash_1 = require("lodash");
const httpStatus_1 = __importDefault(require("../Constants/httpStatus"));
const Errors_1 = require("../Models/Errors");
const defaultErrorHandler = (err, req, res, next) => {
    if (err instanceof Errors_1.ErrorWithStatus) {
        return res.status(err.status).json((0, lodash_1.omit)(err));
    }
    Object.getOwnPropertyNames(err).forEach((key) => {
        Object.defineProperty(err, key, { enumerable: true });
    });
    res.status(httpStatus_1.default.INTERNAL_SERVER_ERROR).json({
        message: err.message,
        errorInfo: err
    });
};
exports.defaultErrorHandler = defaultErrorHandler;
