import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updatedOrder,
  updateOrderStatus,
} from "../controllers/orderController";
import { idValidMiddleware } from "../middleware/idValidMiddleware";
import { authenticationMiddleware } from "../middleware/authenticationMiddleware";
import { orderValidationMiddleware } from "../middleware/orderValidationMiddleware";
import { roleAuthorizationMiddleware } from "../middleware/roleAuthorizationMiddleware";
import { orderStatusValidationMiddleware } from "../middleware/orderStatusValidationMiddleware";

const router = express.Router();

router.param("id", idValidMiddleware);

router
  .route("/")
  .get(authenticationMiddleware, getAllOrders)
  .post(
    orderValidationMiddleware,
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    createOrder
  );

router
  .route("/:id")
  .delete(
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    deleteOrder
  )
  .get(authenticationMiddleware, getOrderById)
  .patch(
    orderValidationMiddleware,
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    updatedOrder
  );

router.route("/order-status/:id")
    .patch(orderStatusValidationMiddleware, authenticationMiddleware, roleAuthorizationMiddleware("Admin"), updateOrderStatus);

router.route("/users/:userId")
    .get(authenticationMiddleware, roleAuthorizationMiddleware("Admin"), getOrdersByUserId);

export default router;
