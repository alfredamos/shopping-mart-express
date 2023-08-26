import { Request, Response, NextFunction } from "express";
import { CategoryModel } from "../models/categoryModel";
import { StatusCodes } from "http-status-codes";
import catchError from "http-errors";
import { categoryValidation } from "../validations/categoryValidation";

export const categoryValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categoryModel = req.body as CategoryModel;

  const { error, value } = categoryValidation(categoryModel);

  if (error) {
    const errorMessages = error.details.map((err) => err.message).join(". ");

    next(
      catchError(
        StatusCodes.BAD_REQUEST,
        `${errorMessages} - please provide all values.`
      )
    );
    return;
  }
  next();
  return value;
};

