"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleUserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const roleUserValidationSchema = joi_1.default.object({
    email: joi_1.default.string().optional().email(),
    name: joi_1.default.string().optional(),
    phone: joi_1.default.string().optional(),
    gender: joi_1.default.optional(),
    role: joi_1.default.optional(),
});
const roleUserValidation = (roleUserModel) => {
    const { name, email, phone, gender, role } = roleUserModel;
    return roleUserValidationSchema.validate({
        name,
        email,
        phone,
        gender,
    }, { abortEarly: false });
};
exports.roleUserValidation = roleUserValidation;
