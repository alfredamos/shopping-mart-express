"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const orderValidationSchema = joi_1.default.object({
    id: joi_1.default.string().optional(),
    userId: joi_1.default.string().required(),
    cartItems: joi_1.default.array().optional()
});
const orderValidation = (orderModel) => {
    const { id, cartItems, userId } = orderModel;
    return orderValidationSchema.validate({ id, cartItems, userId }, { abortEarly: false });
};
exports.orderValidation = orderValidation;
