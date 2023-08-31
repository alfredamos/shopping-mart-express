import express from "express";
import { authenticationMiddleware } from "../middleware/authenticationMiddleware";
import {
  changePassword, 
  login,
  updateUserRole,
  signup,
  updateProfile,
} from "../controllers/authController";
import {currentUser, deleteUser, getAllUsers, getOneUser} from "../controllers/userController"; 
import { userChangePasswordValidationMiddleware } from "../middleware/userChangePasswordValidationMiddleware";
import { userLoginValidationMiddleware } from "../middleware/userLoginValidationMiddleware";
import { userSignupValidationMiddleware } from "../middleware/userSignupValidationMiddleware";
import { userEditProfileValidationMiddleware } from "../middleware/userEditProfileValidationMiddleware";
import { adminAndSelfAuthMiddleware } from "../middleware/adminAndSelfAuthMiddleware";
import { idValidMiddleware } from "../middleware/idValidMiddleware";
import { roleAuthorizationMiddleware } from "../middleware/roleAuthorizationMiddleware";
import { roleUserValidationMiddleware } from "../middleware/roleUserValidationMiddleware";

const router = express.Router();

router.param("id", idValidMiddleware);

router
  .route("/change-password")
  .patch(userChangePasswordValidationMiddleware, authenticationMiddleware, changePassword);

router.route("/current-user").get(authenticationMiddleware, currentUser);

router.route("/login").post(userLoginValidationMiddleware, login);

router
  .route("/change-role")
  .patch(
    roleUserValidationMiddleware,
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    updateUserRole
  );

router.route("/signup").post(userSignupValidationMiddleware, signup);

router
  .route("/users")
  .get(
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    getAllUsers
  );

router
  .route("/edit-profile")
  .patch(userEditProfileValidationMiddleware, authenticationMiddleware, updateProfile);

router
  .route("/users/:id")
  .delete(
    authenticationMiddleware,
    roleAuthorizationMiddleware("Admin"),
    deleteUser
  )
  .get(authenticationMiddleware, adminAndSelfAuthMiddleware, getOneUser);

export default router;
