import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updatedCategory,
} from "../controllers/categoryController";
import { idValidMiddleware } from "../middleware/idValidMiddleware";
import { authenticationMiddleware } from "../middleware/authenticationMiddleware";
import { categoryValidationMiddleware } from "../middleware/categoryValidationMiddleware";
import { roleAuthorizationMiddleware } from "../middleware/roleAuthorizationMiddleware";

const router = express.Router();

router.param("id", idValidMiddleware);

router
  .route("/")
  .get(authenticationMiddleware, getAllCategories)
  .post(
    categoryValidationMiddleware,
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    createCategory
  );

router
  .route("/:id")
  .delete(
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    deleteCategory
  )
  .get(authenticationMiddleware, getCategoryById)
  .patch(
    categoryValidationMiddleware,
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    updatedCategory
  );

export default router;
