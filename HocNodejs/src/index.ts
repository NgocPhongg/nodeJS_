import express from 'express'
import userRouter from './Routes/user.routes'
import databaseservice from './Services/database.services'
import { defaultErrorHandler } from './Middlewares/error.middleware'

databaseservice.connect()
const app = express()
const port = 3000
app.use(express.json())

app.use('/user', userRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
