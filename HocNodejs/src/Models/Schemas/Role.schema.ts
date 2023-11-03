import { ObjectId } from 'mongodb'

interface RoleType {
  _id?: ObjectId
  name: string
  user_id: ObjectId
}
export default class Role {
  _id?: ObjectId
  name?: string
  user_id?: ObjectId
  constructor(role: RoleType) {
    this._id = role._id
    this.name = role.name
    this.user_id = role.user_id
  }
}
