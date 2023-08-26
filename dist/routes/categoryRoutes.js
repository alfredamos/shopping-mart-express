"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const idValidMiddleware_1 = require("../middleware/idValidMiddleware");
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const categoryValidationMiddleware_1 = require("../middleware/categoryValidationMiddleware");
const roleAuthorizationMiddleware_1 = require("../middleware/roleAuthorizationMiddleware");
const router = express_1.default.Router();
router.param("id", idValidMiddleware_1.idValidMiddleware);
router
    .route("/")
    .get(authenticationMiddleware_1.authenticationMiddleware, categoryController_1.getAllCategories)
    .post(categoryValidationMiddleware_1.categoryValidationMiddleware, authenticationMiddleware_1.authenticationMiddleware, (0, roleAuthorizationMiddleware_1.roleAuthorizationMiddleware)("Admin"), categoryController_1.createCategory);
router
    .route("/:id")
    .delete(authenticationMiddleware_1.authenticationMiddleware, (0, roleAuthorizationMiddleware_1.roleAuthorizationMiddleware)("Admin"), categoryController_1.deleteCategory)
    .get(authenticationMiddleware_1.authenticationMiddleware, categoryController_1.getCategoryById)
    .patch(categoryValidationMiddleware_1.categoryValidationMiddleware, authenticationMiddleware_1.authenticationMiddleware, (0, roleAuthorizationMiddleware_1.roleAuthorizationMiddleware)("Admin"), categoryController_1.updatedCategory);
exports.default = router;
