import { RoleUserModel } from "../models/roleUserModel";
import { StatusCodes } from "http-status-codes";
import catchError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { roleUserValidation } from "../validations/roleUserValidation";

export const roleUserValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const roleUserModel = req.body as RoleUserModel;

  const { error, value } = roleUserValidation(roleUserModel);

  if (error) {
    const errorMessages = error.details.map((err) => err.message).join(". ");
    next(
      catchError(
        StatusCodes.BAD_REQUEST,
        `${errorMessages} - Please provide all values!`
      )
    );
    return;
  }
  next();

  return value;
};
