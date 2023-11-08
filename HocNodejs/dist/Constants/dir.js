"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_TEMP_DRI = exports.UPLOAD_DRI = void 0;
const path_1 = __importDefault(require("path"));
exports.UPLOAD_DRI = path_1.default.resolve('uploads');
exports.UPLOAD_TEMP_DRI = path_1.default.resolve('uploads/images');
