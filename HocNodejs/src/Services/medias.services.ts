import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_DRI } from '~/Constants/dir'
import { getNameFullName, handlerUploadImage } from '~/Utils/file'
import fs from 'fs'
import { isProduction } from '~/Constants/config'
import { config } from 'dotenv'
import databaseservice from './database.services'
config()

class MediasService {
  async handleUploadSingImage(req: Request) {
    const file = await handlerUploadImage(req)
    const newName = getNameFullName(file.newFilename)
    const newPath = path.resolve(UPLOAD_DRI, `${newName}.jpg`)
    await sharp(file.filepath).jpeg({ quality: 50 }).toFile(newPath) // whith metadata là dữ liệu tên hình ảnh cũ lên tìm shrap
    fs.unlinkSync(file.filepath) // xóa file thư mục image
    return isProduction
      ? `${process.env.HOST}/imageMedias/${newName}.jpg`
      : `http://localhost:${process.env.PORT}/imageMedias/${newName}.jpg`
  }
}
const mediasService = new MediasService()
export default mediasService
