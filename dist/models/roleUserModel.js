"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleUserModel = void 0;
/* eslint-disable prettier/prettier */
const client_1 = require("@prisma/client");
class RoleUserModel {
    constructor() {
        this.name = "";
        this.email = "";
        this.phone = "";
        this.gender = client_1.Gender.Male;
        this.role = client_1.Role.Customer;
    }
}
exports.RoleUserModel = RoleUserModel;
