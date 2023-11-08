"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const dir_1 = require("../Constants/dir");
const file_1 = require("../Utils/file");
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../Constants/config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class MediasService {
    async handleUploadSingImage(req) {
        const file = await (0, file_1.handlerUploadImage)(req);
        const newName = (0, file_1.getNameFullName)(file.newFilename);
        const newPath = path_1.default.resolve(dir_1.UPLOAD_DRI, `${newName}.jpg`);
        await (0, sharp_1.default)(file.filepath).jpeg({ quality: 50 }).toFile(newPath); // whith metadata là dữ liệu tên hình ảnh cũ lên tìm shrap
        fs_1.default.unlinkSync(file.filepath); // xóa file thư mục image
        return config_1.isProduction
            ? `${process.env.HOST}/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/imageMedias/${newName}`;
    }
}
const mediasService = new MediasService();
exports.default = mediasService;
