"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
require("express-async-errors");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cartItemRoutes_1 = __importDefault(require("./routes/cartItemRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const notFoundRouteMiddleware_1 = require("./middleware/notFoundRouteMiddleware");
const errorHandlerMiddleware_1 = require("./middleware/errorHandlerMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
//app.use(express.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/cart-items", cartItemRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use(notFoundRouteMiddleware_1.notFoundRouteMiddleware);
app.use(errorHandlerMiddleware_1.errorHandlerMiddleware);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App is listening ${port}`));
