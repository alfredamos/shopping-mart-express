"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const orderStatusValidationSchema = joi_1.default.object({
    status: joi_1.default.string().required(),
});
const orderStatusValidation = (orderStatusModel) => {
    const { status } = orderStatusModel;
    return orderStatusValidationSchema.validate({ status }, { abortEarly: false });
};
exports.orderStatusValidation = orderStatusValidation;
