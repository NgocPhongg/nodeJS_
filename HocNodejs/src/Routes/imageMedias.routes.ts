import express, { Router } from 'express'
import { uploadSingleImageController } from '~/Controllers/imageMedias.controller'
import { wrapRequestHandler } from '~/Utils/handlers'
const imageMediasRouter = express.Router()

imageMediasRouter.post('/image-medias', wrapRequestHandler(uploadSingleImageController))
export default imageMediasRouter
