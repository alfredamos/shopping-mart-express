"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const idValidMiddleware_1 = require("../middleware/idValidMiddleware");
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const orderValidationMiddleware_1 = require("../middleware/orderValidationMiddleware");
const roleAuthorizationMiddleware_1 = require("../middleware/roleAuthorizationMiddleware");
const router = express_1.default.Router();
router.param("id", idValidMiddleware_1.idValidMiddleware);
router
    .route("/")
    .get(authenticationMiddleware_1.authenticationMiddleware, orderController_1.getAllOrders)
    .post(orderValidationMiddleware_1.orderValidationMiddleware, authenticationMiddleware_1.authenticationMiddleware, (0, roleAuthorizationMiddleware_1.roleAuthorizationMiddleware)("Admin"), orderController_1.createOrder);
router
    .route("/:id")
    .delete(authenticationMiddleware_1.authenticationMiddleware, (0, roleAuthorizationMiddleware_1.roleAuthorizationMiddleware)("Admin"), orderController_1.deleteOrder)
    .get(authenticationMiddleware_1.authenticationMiddleware, orderController_1.getOrderById)
    .patch(orderValidationMiddleware_1.orderValidationMiddleware, authenticationMiddleware_1.authenticationMiddleware, (0, roleAuthorizationMiddleware_1.roleAuthorizationMiddleware)("Admin"), orderController_1.updatedOrder);
router.route("/users/:userId")
    .get(authenticationMiddleware_1.authenticationMiddleware, (0, roleAuthorizationMiddleware_1.roleAuthorizationMiddleware)("Admin"), orderController_1.getOrdersByUserId);
exports.default = router;
