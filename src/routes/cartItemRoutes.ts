import express from "express";
import {
  createCartItem,
  deleteCartItem,
  getAllCartItems,
  getCartItemById,
  updatedCartItem,
} from "../controllers/cartItemController";
import { idValidMiddleware } from "../middleware/idValidMiddleware";
import { authenticationMiddleware } from "../middleware/authenticationMiddleware";
import { cartItemValidationMiddleware } from "../middleware/cartItemValidationMiddleware";
import { roleAuthorizationMiddleware } from "../middleware/roleAuthorizationMiddleware";

const router = express.Router();

router.param("id", idValidMiddleware);

router
  .route("/")
  .get(authenticationMiddleware, getAllCartItems)
  .post(
    cartItemValidationMiddleware,
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    createCartItem
  );

router
  .route("/:id")
  .delete(
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    deleteCartItem
  )
  .get(authenticationMiddleware, getCartItemById)
  .patch(
    cartItemValidationMiddleware,
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    updatedCartItem
  );

export default router;
