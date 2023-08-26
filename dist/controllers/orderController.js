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
exports.updatedOrder = exports.getOrderById = exports.getAllOrders = exports.deleteOrder = exports.createOrder = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const productDb_1 = require("../db/productDb");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get new order input from body.
    const { body: newOrder } = req;
    //----> Store the new order in the database.
    const createdOrder = yield productDb_1.prisma.order.create({
        data: Object.assign({}, newOrder),
    });
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ status: "success", createdOrder });
});
exports.createOrder = createOrder;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the order id from params.
    const { id } = req.params;
    //----> Check the existence of the order in the database.
    const order = yield productDb_1.prisma.order.findUnique({ where: { id } });
    //----> Throw error for non existence order.
    if (!order) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Order with id = ${id} is not found.`);
    }
    //----> Delete the order from the database.
    const deletedOrder = yield productDb_1.prisma.order.delete({ where: { id } });
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: "success", deletedOrder });
});
exports.deleteOrder = deleteOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get orders from database.
    const orders = yield productDb_1.prisma.order.findMany();
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: "success", orders });
});
exports.getAllOrders = getAllOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the order id from params
    const { id } = req.params;
    //----> Check for the existence of order in the database.
    const order = yield productDb_1.prisma.order.findUnique({ where: { id } });
    //----> Throw error for non existent order.
    if (!order) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Order with id = ${id} is not found.`);
    }
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: "success", order });
});
exports.getOrderById = getOrderById;
const updatedOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the order id from params.
    const { id } = req.params;
    //----> Get the order to edit input data from body.
    const { body: orderToEdit } = req;
    //----> Check for the existence of the said order in the database.
    const order = yield productDb_1.prisma.order.findUnique({ where: { id } });
    //----> Throw error for non existent order.
    if (!order) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Order with id = ${id} is not found.`);
    }
    //----> Store the edited order in the database.
    const editedOrder = yield productDb_1.prisma.order.update({
        where: { id },
        data: Object.assign({}, orderToEdit),
    });
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: "success", editedOrder });
});
exports.updatedOrder = updatedOrder;
