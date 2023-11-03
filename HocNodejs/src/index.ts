import express from 'express'
import userRouter from './Routes/user.routes'
import databaseservice from './Services/database.services'
import { defaultErrorHandler } from './Middlewares/error.middleware'
import cors from 'cors'
const app = express()

app.use(
  cors({
    origin: '*',
    credentials: true
  })
)
databaseservice.connect()
const port = 3000
app.use(express.json())

app.use('/user', userRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
