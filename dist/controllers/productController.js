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
exports.updatedProduct = exports.getProductsByCategoryId = exports.getProductById = exports.getAllProducts = exports.deleteProduct = exports.createProduct = void 0;
const productDb_1 = require("../db/productDb");
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get new product input from body.
    const { body: newProduct } = req;
    const { categoryId } = req.body;
    //----> Retrieve the product category.
    const category = yield productDb_1.prisma.category.findUnique({
        where: { id: categoryId },
    });
    if (!category) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Category with id : ${categoryId} is not found in the database!`);
    }
    //----> Store the new product in the database.
    const product = yield productDb_1.prisma.product.create({
        data: Object.assign({}, newProduct),
    });
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.CREATED).json(product);
});
exports.createProduct = createProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the product id from params.
    const { id } = req.params;
    //----> Check the existence of the product in the database.
    const product = yield productDb_1.prisma.product.findUnique({ where: { id } });
    //----> Throw error for non existence product.
    if (!product) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Product with id = ${id} is not found.`);
    }
    //----> Delete the product from the database.
    const deletedProduct = yield productDb_1.prisma.product.delete({ where: { id } });
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json(deletedProduct);
});
exports.deleteProduct = deleteProduct;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get products from database.
    const products = yield productDb_1.prisma.product.findMany({
        include: {
            category: {
                select: { name: true },
            },
        },
    });
    if (!products || products.length === 0) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Products are empty!");
    }
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.OK).json(products);
});
exports.getAllProducts = getAllProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the product id from params
    const { id } = req.params;
    //----> Check for the existence of product in the database.
    const product = yield productDb_1.prisma.product.findUnique({ where: { id }, include: { category: { select: { name: true } } } });
    //----> Throw error for non existent product.
    if (!product) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Product with id = ${id} is not found.`);
    }
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.OK).json(product);
});
exports.getProductById = getProductById;
const getProductsByCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Extract the category id from params.
    const { categoryId } = req.params;
    //----> Get products by category id.
    const products = yield productDb_1.prisma.product.findMany({ where: { categoryId }, include: { category: { select: { name: true } } } });
    //----> Check for existence of products.
    if (!products || products.length === 0) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Products with categoryId : ${categoryId} is available in the database!`);
    }
    //----> Send back the respond.
    res.status(http_status_codes_1.StatusCodes.OK).json(products);
});
exports.getProductsByCategoryId = getProductsByCategoryId;
const updatedProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the product id from params.
    const { id } = req.params;
    //----> Get the product to edit input data from body.
    const { body: productToEdit } = req;
    const { categoryId } = req.body;
    //----> Retrieve the product category.
    const category = yield productDb_1.prisma.category.findUnique({
        where: { id: categoryId },
    });
    if (!category) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Category with id : ${categoryId} is not found in the database!`);
    }
    //----> Check for the existence of the said product in the database.
    const product = yield productDb_1.prisma.product.findUnique({ where: { id } });
    //----> Throw error for non existent product.
    if (!product) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Product with id = ${id} is not found.`);
    }
    //----> Store the edited product in the database.
    const editedProduct = yield productDb_1.prisma.product.update({
        where: { id },
        data: Object.assign({}, productToEdit),
    });
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json(editedProduct);
});
exports.updatedProduct = updatedProduct;
