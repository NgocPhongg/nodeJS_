"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Address {
    _id;
    // name: string
    province;
    district;
    award;
    detail;
    user_id;
    constructor(address) {
        this._id = address._id;
        this.province = address.province || '';
        this.district = address.district || '';
        this.award = address.award || '';
        this.detail = address.detail || '';
        this.user_id = address.user_id;
        // this.name = address.name || ''
    }
}
exports.default = Address;
// export default class Address {
//   _id?: ObjectId
//   province: string
//   district: string
//   award: string
//   detail: string
//   phone: string
//   user_id: ObjectId
//   constructor({ _id, province, district, award, detail, phone, user_id }: AddressType) {
//     this._id = _id
//     this.province = province || ''
//     this.district = district || ''
//     this.award = award || ''
//     this.detail = detail || ''
//     this.phone = phone || ''
//     this.user_id = user_id
//   }
// }
