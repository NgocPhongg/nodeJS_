"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNameFullName = exports.handlerUploadImage = exports.initFolder = void 0;
const formidable_1 = __importDefault(require("formidable"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dir_1 = require("../Constants/dir");
const initFolder = () => {
    // const newFileUpload = path.resolve(UPLOAD_TEMP_DRI)
    if (!fs_1.default.existsSync(dir_1.UPLOAD_TEMP_DRI)) {
        fs_1.default.mkdirSync(dir_1.UPLOAD_TEMP_DRI, {
            recursive: true // này là tạo folder cha
        });
    }
};
exports.initFolder = initFolder;
const handlerUploadImage = async (req) => {
    // const formidable = (await import('formidable')).default
    const form = (0, formidable_1.default)({
        uploadDir: path_1.default.resolve(dir_1.UPLOAD_TEMP_DRI),
        maxFiles: 1,
        keepExtensions: true,
        maxFileSize: 3000 * 1024,
        filter: function ({ name, originalFilename, mimetype }) {
            const valid = name === 'image' && Boolean(mimetype?.includes('image/'));
            if (!valid) {
                form.emit('error', new Error('Nhap du lieu khong hop le'));
            }
            return valid;
        }
    });
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            // eslint-disable-next-line no-extra-boolean-cast
            if (!Boolean(files.image)) {
                return reject(new Error('File anh trong'));
            }
            resolve(files.image[0]);
            // res.json({ fields, files, mesage: 'upload thanh cong' })
        });
    });
};
exports.handlerUploadImage = handlerUploadImage;
const getNameFullName = (fullName) => {
    const namearr = fullName.split('.');
    namearr.pop();
    return namearr.join('');
};
exports.getNameFullName = getNameFullName;
