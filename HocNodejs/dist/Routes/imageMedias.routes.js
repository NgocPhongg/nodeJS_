"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageMedias_controller_1 = require("../Controllers/imageMedias.controller");
const handlers_1 = require("../Utils/handlers");
const imageMediasRouter = express_1.default.Router();
imageMediasRouter.post('/image-medias', (0, handlers_1.wrapRequestHandler)(imageMedias_controller_1.uploadSingleImageController));
exports.default = imageMediasRouter;
