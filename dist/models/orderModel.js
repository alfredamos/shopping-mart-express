"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const client_1 = require("@prisma/client");
class OrderModel {
    constructor() {
        this.id = "";
        this.total = 0;
        this.items = 0;
        this.cartItems = [];
        this.status = client_1.Status.Pending;
    }
}
exports.OrderModel = OrderModel;
