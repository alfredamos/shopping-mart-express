"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedCategory = exports.getCategoryById = exports.getAllCategories = exports.deleteCategory = exports.createCategory = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const productDb_1 = require("../db/productDb");
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get new category input from body.
    const { body: newCategory } = req;
    //----> Store the new category in the database.
    const category = yield productDb_1.prisma.category.create({
        data: Object.assign({}, newCategory),
    });
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.CREATED).json(category);
});
exports.createCategory = createCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the category id from params.
    const { id } = req.params;
    //----> Check the existence of the category in the database.
    const category = yield productDb_1.prisma.category.findUnique({ where: { id } });
    //----> Throw error for non existence category.
    if (!category) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Category with id = ${id} is not found.`);
    }
    //----> Delete the category from the database.
    const deletedCategory = yield productDb_1.prisma.category.delete({ where: { id } });
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json(deletedCategory);
});
exports.deleteCategory = deleteCategory;
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get categories from database.
    const categories = yield productDb_1.prisma.category.findMany();
    if (!categories || categories.length === 0) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Categories are empty!");
    }
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.OK).json(categories);
});
exports.getAllCategories = getAllCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the category id from params
    const { id } = req.params;
    //----> Check for the existence of category in the database.
    const category = yield productDb_1.prisma.category.findUnique({ where: { id } });
    //----> Throw error for non existent category.
    if (!category) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Category with id = ${id} is not found.`);
    }
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.OK).json(category);
});
exports.getCategoryById = getCategoryById;
const updatedCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the category id from params.
    const { id } = req.params;
    //----> Get the category to edit input data from body.
    const { body: categoryToEdit } = req;
    //----> Check for the existence of the said category in the database.
    const category = yield productDb_1.prisma.category.findUnique({ where: { id } });
    //----> Throw error for non existent category.
    if (!category) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Category with id = ${id} is not found.`);
    }
    //----> Store the edited category in the database.
    const editedCategory = yield productDb_1.prisma.category.update({
        where: { id },
        data: Object.assign({}, categoryToEdit),
    });
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json(editedCategory);
});
exports.updatedCategory = updatedCategory;
