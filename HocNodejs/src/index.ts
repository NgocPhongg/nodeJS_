import express from 'express'
import userRouter from './Routes/user.routes'
import databaseservice from './Services/database.services'
const app = express()
const port = 3000
app.use(express.json())

app.use('/user', userRouter)
databaseservice.connect()
app.get('/', (req, res) => {
  res.send('hello world')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
