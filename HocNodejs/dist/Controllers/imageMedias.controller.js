"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingleImageController = void 0;
const path_1 = __importDefault(require("path"));
const medias_services_1 = __importDefault(require("../Services/medias.services"));
const uploadSingleImageController = async (req, res, next) => {
    const medias = await medias_services_1.default.handleUploadSingImage(req);
    // const data = await handlerUploadImage(req)
    return res.status(200).json({
        result: medias
    });
};
exports.uploadSingleImageController = uploadSingleImageController;
console.log(path_1.default.resolve('uploads'));
