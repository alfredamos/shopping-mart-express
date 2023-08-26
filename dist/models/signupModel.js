"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupModel = void 0;
/* eslint-disable prettier/prettier */
const userModel_1 = require("./userModel");
class SignupModel extends userModel_1.User {
    constructor() {
        super(...arguments);
        this.confirmPassword = "";
    }
}
exports.SignupModel = SignupModel;
