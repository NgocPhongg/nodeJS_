import { ObjectId } from 'mongodb'

interface RoleType {
  _id_role?: ObjectId
  name: string
}
export default class Role {
  _id_role?: ObjectId
  name?: string
  constructor(role: RoleType) {
    this._id_role = role._id_role
    this.name = role.name

  }
}
