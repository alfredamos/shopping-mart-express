import express from "express";
import cors from "cors";
import dotenv from "dotenv";
require("express-async-errors");

import authRouter from "./routes/authRoutes";
import cartItemRouter from "./routes/cartItemRoutes";
import categoryRouter from "./routes/categoryRoutes";
import orderRouter from "./routes/orderRoutes";
import productRouter from "./routes/productRoutes";
import userRouter from "./routes/userRoutes";
import { notFoundRouteMiddleware } from "./middleware/notFoundRouteMiddleware";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware";

dotenv.config();

const app = express();

app.use(cors());
//app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/cart-items", cartItemRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

app.use(notFoundRouteMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App is listening ${port}`));
