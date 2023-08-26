"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartItemController_1 = require("../controllers/cartItemController");
const idValidMiddleware_1 = require("../middleware/idValidMiddleware");
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const cartItemValidationMiddleware_1 = require("../middleware/cartItemValidationMiddleware");
const roleAuthorizationMiddleware_1 = require("../middleware/roleAuthorizationMiddleware");
const router = express_1.default.Router();
router.param("id", idValidMiddleware_1.idValidMiddleware);
router
    .route("/")
    .get(authenticationMiddleware_1.authenticationMiddleware, cartItemController_1.getAllCartItems)
    .post(cartItemValidationMiddleware_1.cartItemValidationMiddleware, authenticationMiddleware_1.authenticationMiddleware, (0, roleAuthorizationMiddleware_1.roleAuthorizationMiddleware)("Admin"), cartItemController_1.createCartItem);
router
    .route("/:id")
    .delete(authenticationMiddleware_1.authenticationMiddleware, (0, roleAuthorizationMiddleware_1.roleAuthorizationMiddleware)("Admin"), cartItemController_1.deleteCartItem)
    .get(authenticationMiddleware_1.authenticationMiddleware, cartItemController_1.getCartItemById)
    .patch(cartItemValidationMiddleware_1.cartItemValidationMiddleware, authenticationMiddleware_1.authenticationMiddleware, (0, roleAuthorizationMiddleware_1.roleAuthorizationMiddleware)("Admin"), cartItemController_1.updatedCartItem);
exports.default = router;
