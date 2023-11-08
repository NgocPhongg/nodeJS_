import { NextFunction, Request, Response } from 'express'
import path, { join } from 'path'
import mediasService from '~/Services/medias.services'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.handleUploadSingImage(req)
  // const data = await handlerUploadImage(req)
  return res.status(200).json({
    message: 'Lấy ảnh thành công',
    result: url
  })
}
console.log(path.resolve('uploads'))
