import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { UPLOAD_TEMP_DRI } from '~/Constants/dir'

export const initFolder = () => {
  // const newFileUpload = path.resolve(UPLOAD_TEMP_DRI)
  if (!fs.existsSync(UPLOAD_TEMP_DRI)) {
    fs.mkdirSync(UPLOAD_TEMP_DRI, {
      recursive: true // này là tạo folder cha
    })
  }
}
export const handlerUploadImage = async (req: Request) => {
  // const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_TEMP_DRI),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 3000 * 1024, // 300kb
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('Nhap du lieu khong hop le') as any)
      }
      return valid
    }
  })
  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File anh trong'))
      }
      resolve((files.image as File[])[0])

      // res.json({ fields, files, mesage: 'upload thanh cong' })
    })
  })
}
export const getNameFullName = (fullName: string) => {
  const namearr = fullName.split('.')
  namearr.pop()
  return namearr.join('')
}
