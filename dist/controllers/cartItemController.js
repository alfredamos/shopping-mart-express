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
exports.updatedCartItem = exports.getCartItemById = exports.getAllCartItems = exports.deleteCartItem = exports.createCartItem = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const productDb_1 = require("../db/productDb");
const createCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get new cartItem input from body.
    const { body: newCartItem } = req;
    const { productId } = req.body;
    //----> Retrieve the product attach to cartItem.
    const product = yield productDb_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `The product with id : ${productId} is not found in the database!`);
    }
    //----> Store the new cartItem in the database.
    const createdCartItem = yield productDb_1.prisma.cartItem.create({
        data: Object.assign({}, newCartItem),
    });
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.CREATED).json(createdCartItem);
});
exports.createCartItem = createCartItem;
const deleteCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the cartItem id from params.
    const { id } = req.params;
    //----> Check the existence of the cartItem in the database.
    const cartItem = yield productDb_1.prisma.cartItem.findUnique({ where: { id } });
    //----> Throw error for non existence cartItem.
    if (!cartItem) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `CartItem with id = ${id} is not found.`);
    }
    //----> Delete the cartItem from the database.
    const deletedCartItem = yield productDb_1.prisma.cartItem.delete({ where: { id } });
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json(deletedCartItem);
});
exports.deleteCartItem = deleteCartItem;
const getAllCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get cartItems from database.
    const cartItems = yield productDb_1.prisma.cartItem.findMany({
        select: {
            id: true,
            quantity: true,
            price: true,
            productId: true,
            order: {
                select: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            phone: true,
                            gender: true,
                        },
                    },
                    id: true,
                },
            },
            product: {
                select: {
                    name: true,
                    brand: true,
                    price: true,
                },
            },
        },
    });
    if (!cartItems || cartItems.length === 0) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "CarItems are empty! ");
    }
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.OK).json(cartItems);
});
exports.getAllCartItems = getAllCartItems;
const getCartItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the cartItem id from params
    const { id } = req.params;
    //----> Check for the existence of cartItem in the database.
    const cartItem = yield productDb_1.prisma.cartItem.findUnique({
        where: { id },
        select: {
            id: true,
            quantity: true,
            price: true,
            productId: true,
            order: {
                select: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            phone: true,
                            gender: true,
                        },
                    },
                    id: true,
                },
            },
            product: {
                select: {
                    name: true,
                    brand: true,
                    price: true,
                },
            },
        },
    });
    //----> Throw error for non existent cartItem.
    if (!cartItem) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `CartItem with id = ${id} is not found.`);
    }
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.OK).json(cartItem);
});
exports.getCartItemById = getCartItemById;
const updatedCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the cartItem id from params.
    const { id } = req.params;
    const { productId } = req.body;
    //----> Retrieve the product attach to cartItem.
    const product = yield productDb_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `The product with id : ${productId} is not found in the database!`);
    }
    //----> Get the cartItem to edit input data from body.
    const { body: cartItemToEdit } = req;
    //----> Check for the existence of the said cartItem in the database.
    const cartItem = yield productDb_1.prisma.cartItem.findUnique({ where: { id } });
    //----> Throw error for non existent cartItem.
    if (!cartItem) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `CartItem with id = ${id} is not found.`);
    }
    //----> Store the edited cartItem in the database.
    const editedCartItem = yield productDb_1.prisma.cartItem.update({
        where: { id },
        data: Object.assign({}, cartItemToEdit),
    });
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json(editedCartItem);
});
exports.updatedCartItem = updatedCartItem;
