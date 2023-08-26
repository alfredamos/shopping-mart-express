"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/* eslint-disable prettier/prettier */
const client_1 = require("@prisma/client");
class User {
    constructor() {
        this.id = "";
        this.name = "";
        this.email = "";
        this.phone = "";
        this.password = "";
        this.gender = client_1.Gender.Male;
    }
}
exports.User = User;
