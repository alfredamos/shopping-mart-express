"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const productValidationSchema = joi_1.default.object({
    id: joi_1.default.string().optional(),
    name: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
    quantity: joi_1.default.number().required(),
    rating: joi_1.default.number().optional(),
    description: joi_1.default.string().optional(),
    // productImage: Joi.string().optional(),
    brand: joi_1.default.string().required(),
    categoryId: joi_1.default.string().required(),
});
const productValidation = (productModel) => {
    const { id, name, price, rating, brand, categoryId, description, quantity, productImage } = productModel;
    return productValidationSchema.validate({
        id,
        brand,
        categoryId,
        description,
        name,
        price,
        rating,
        //  productImage,
        quantity
    }, { abortEarly: false });
};
exports.productValidation = productValidation;
