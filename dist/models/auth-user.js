"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = void 0;
/* eslint-disable prettier/prettier */
const client_1 = require("@prisma/client");
class UserInfo {
    constructor() {
        this.id = "";
        this.name = "";
        this.role = client_1.Role.Customer;
        this.token = "";
        this.message = "";
    }
}
exports.UserInfo = UserInfo;
