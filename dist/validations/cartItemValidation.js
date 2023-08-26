"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartItemValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const cartItemValidationSchema = joi_1.default.object({
    id: joi_1.default.string().optional(),
    orderId: joi_1.default.string().optional(),
    productId: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
    quantity: joi_1.default.number().required()
});
const cartItemValidation = (cartItemModel) => {
    const { id, orderId, price, productId, quantity } = cartItemModel;
    return cartItemValidationSchema.validate({ id, orderId, price, productId, quantity }, { abortEarly: false });
};
exports.cartItemValidation = cartItemValidation;
