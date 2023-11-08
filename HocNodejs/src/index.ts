import express from 'express'
import userRouter from './Routes/user.routes'
import databaseservice from './Services/database.services'
import { defaultErrorHandler } from './Middlewares/error.middleware'
import cors from 'cors'
import imageMediasRouter from './Routes/imageMedias.routes'
import { initFolder } from './Utils/file'
import { config } from 'dotenv'
import { UPLOAD_DRI } from './Constants/dir'

config()

const app = express()

app.use(
  cors({
    origin: '*',
    credentials: true
  })
)
databaseservice.connect()
const port = process.env.PORT || 4000
// console.log(options.development)
// minimits
// console.log(process.argv)
app.use('/imageMedias', express.static(UPLOAD_DRI))
app.use(express.json())
app.use('/user', userRouter)
app.use('/imageMedias', imageMediasRouter)
app.use(defaultErrorHandler)

// tạo folder upload
initFolder()
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
