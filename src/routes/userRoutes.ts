import express from "express";
import {  
  signup as createUser,
  updateProfile as editUser,
  updateUserRole,
} from "../controllers/authController";
import {
  deleteUser,
  deleteUserByEmail,
  getAllUsers,
  getOneUser,
} from "../controllers/userController";

import { authenticationMiddleware } from "../middleware/authenticationMiddleware";
import { roleAuthorizationMiddleware } from "../middleware/roleAuthorizationMiddleware";
import { userSignupValidationMiddleware as userCreateValidationMiddleware } from "../middleware/userSignupValidationMiddleware";
import { adminAndSelfAuthMiddleware } from "../middleware/adminAndSelfAuthMiddleware";
import { userEditProfileValidationMiddleware } from "../middleware/userEditProfileValidationMiddleware";
import { roleUserValidationMiddleware } from "../middleware/roleUserValidationMiddleware";

const router = express.Router();

router
  .route("/")
  .get(
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    getAllUsers
  )
  .post(
    userCreateValidationMiddleware,
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    createUser
  );

router
  .route("/change-role")
  .patch(
    roleUserValidationMiddleware,
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    updateUserRole
  );

router
  .route("/users-by-email")
  .delete(
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    deleteUserByEmail
  );

router
  .route("/:id")
  .delete(
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    deleteUser
  )
  .get(authenticationMiddleware, adminAndSelfAuthMiddleware, getOneUser)
  .patch(
    userEditProfileValidationMiddleware,
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    editUser
  );

router
  .route("/auth/delete-by-email")
  .delete(
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    deleteUserByEmail
  );

export default router;
