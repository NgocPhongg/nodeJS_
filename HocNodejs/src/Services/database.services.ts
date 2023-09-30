import { MongoClient, Db, Collection } from 'mongodb'
// tải dotenv để config vào
import { config } from 'dotenv'
import User from '~/Models/Schemas/User.schema'
import ResFreshToken from '~/Models/Schemas/ResFreshToken.schema'
//khi nào có process.env thì phải gọi config()
config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@atlascluster.eml4bmb.mongodb.net/?retryWrites=true&w=majority`
class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLECTION as string)
  }
  get resFreshToken(): Collection<ResFreshToken> {
    return this.db.collection(process.env.DB_RESFRESHTOKEN_COLECTION as string)
  }
}
// run().catch(console.dir)
// tạo obj từ class databaseservice
const databaseservice = new DatabaseService()
export default databaseservice
