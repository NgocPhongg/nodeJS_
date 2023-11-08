"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Role {
    _id_role;
    name;
    constructor(role) {
        this._id_role = role._id_role;
        this.name = role.name;
    }
}
exports.default = Role;
