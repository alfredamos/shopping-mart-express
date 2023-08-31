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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.updatedOrder = exports.getOrdersByUserId = exports.getOrderById = exports.getAllOrders = exports.deleteOrder = exports.createOrder = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const productDb_1 = require("../db/productDb");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Destructure cart items from the createOrderDto
    const _a = req.body, { cartItems } = _a, rests = __rest(_a, ["cartItems"]);
    const userId = rests === null || rests === void 0 ? void 0 : rests.userId;
    //----> Retrieve the user attached to this order
    const user = yield productDb_1.prisma.user.findUnique({ where: { id: userId } });
    //---> Check for the existence of user.
    if (!user) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `The user with userId = ${userId} doesn't exist in the database!`);
    }
    //----> Aggregate the total price of all cart items.
    rests.total = totalPrice(cartItems);
    rests.items = totalNumberOfItems(cartItems);
    //----> Create an order.
    const order = yield productDb_1.prisma.order.create({
        data: Object.assign(Object.assign({}, rests), { cartItems: {
                createMany: {
                    data: [...cartItems],
                },
            } }),
        include: {
            cartItems: true,
        },
    });
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.CREATED).json(order);
});
exports.createOrder = createOrder;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the order id from params.
    const { id } = req.params;
    //----> Retrieve the order.
    const order = yield productDb_1.prisma.order.findUnique({ where: { id } });
    //----> Check for existence of order.
    if (!order) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `The order with id : ${id} is not found in the database!`);
    }
    //----> Delete the cart items from the database.
    yield productDb_1.prisma.order.update({
        where: {
            id,
        },
        data: {
            cartItems: {
                deleteMany: {},
            },
        },
    });
    //----> Delete the order.
    const deletedOrder = yield productDb_1.prisma.order.delete({ where: { id } });
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json(deletedOrder);
});
exports.deleteOrder = deleteOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get orders from database.
    const orders = yield productDb_1.prisma.order.findMany({
        include: {
            cartItems: {
                select: {
                    product: true,
                    id: true,
                    quantity: true,
                    price: true,
                },
            },
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                    gender: true,
                },
            },
        },
    });
    if (!orders || orders.length === 0) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Orders are empty!");
    }
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.OK).json(orders);
});
exports.getAllOrders = getAllOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the order id from params
    const { id } = req.params;
    //----> Check for the existence of order in the database.
    const order = yield productDb_1.prisma.order.findUnique({
        where: { id },
        include: {
            cartItems: {
                select: {
                    product: true,
                    id: true,
                    quantity: true,
                    price: true,
                },
            },
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                    gender: true,
                },
            },
        },
    });
    //----> Throw error for non existent order.
    if (!order) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Order with id = ${id} is not found.`);
    }
    //----> Send back response.
    res.status(http_status_codes_1.StatusCodes.OK).json(order);
});
exports.getOrderById = getOrderById;
const getOrdersByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Extract the user id from params.
    const { userId } = req.params;
    //----> Get orders by user id.
    const orders = yield productDb_1.prisma.order.findMany({
        where: { userId },
        include: {
            cartItems: {
                select: {
                    product: true,
                    id: true,
                    quantity: true,
                    price: true,
                },
            },
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                    gender: true,
                },
            },
        },
    });
    //----> Check for the existence of orders.
    if (!orders || orders.length === 0) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `Orders by user with userId : ${userId}`);
    }
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json(orders);
});
exports.getOrdersByUserId = getOrdersByUserId;
const updatedOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the order id from params.
    const { id } = req.params;
    //----> Destructure the payload.
    const _b = req.body, { cartItems } = _b, rests = __rest(_b, ["cartItems"]);
    const userId = rests === null || rests === void 0 ? void 0 : rests.userId;
    console.log({ cartItems, rests, userId });
    //----> Retrieve the user attached to this order
    const user = yield productDb_1.prisma.user.findUnique({
        where: { id: userId },
        include: {},
    });
    console.log({ user });
    //---> Check for the existence of user.
    if (!user) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `The user with userId = ${userId} doesn't exist in the database!`);
    }
    //----> Retrieve the order.
    const order = yield productDb_1.prisma.order.findUnique({ where: { id } });
    //----> Check for existence of order.
    if (!order) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `The order with id : ${id} is not found in the database!`);
    }
    //----> Update cart items.
    updateCartItems(cartItems);
    //----> Aggregate the total price of all cart items.
    rests.total = totalPrice(cartItems);
    rests.items = totalNumberOfItems(cartItems);
    //----> Update the order in the database.
    yield productDb_1.prisma.order.update({
        where: { id },
        data: Object.assign({}, rests),
    });
    //----> Retrieve the latest updated order.
    const updatedOrder = yield productDb_1.prisma.order.findUnique({
        where: { id },
        include: {
            cartItems: true,
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                    gender: true,
                },
            },
        },
    });
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedOrder);
});
exports.updatedOrder = updatedOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get the id of the order to update its status.
    const { id } = req.params;
    //----> Retrieve the status from request body.
    const { status } = req.body;
    //----> Retrieve the order to update his status from database.
    const order = yield productDb_1.prisma.order.findUnique({ where: { id } });
    //----> Check for the existence of order.
    if (!order) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `The order with id : ${id} is not found the database!`);
    }
    //----> Update the order status in the database.
    const updatedOrder = yield productDb_1.prisma.order.update({
        where: { id },
        data: Object.assign(Object.assign({}, order), { status }),
    });
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedOrder);
});
exports.updateOrderStatus = updateOrderStatus;
function totalPrice(cartItems) {
    return cartItems.reduce((prev, cartItem) => Number(cartItem.price) * cartItem.quantity + prev, 0);
}
function totalNumberOfItems(cartItems) {
    return cartItems.reduce((prev, cartItem) => Number(cartItem.quantity) + prev, 0);
}
function updateCartItems(cartItems) {
    return cartItems.map((item) => __awaiter(this, void 0, void 0, function* () {
        yield productDb_1.prisma.cartItem.update({
            where: { id: item.id },
            data: Object.assign({}, item),
        });
    }));
}
