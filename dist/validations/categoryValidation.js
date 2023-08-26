"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const categoryValidationSchema = joi_1.default.object({
    id: joi_1.default.string().optional(),
    name: joi_1.default.string().required(),
});
const categoryValidation = (categoryModel) => {
    const { id, name } = categoryModel;
    return categoryValidationSchema.validate({ id, name }, { abortEarly: false });
};
exports.categoryValidation = categoryValidation;
