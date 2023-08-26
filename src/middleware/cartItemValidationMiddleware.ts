import { Request, Response, NextFunction } from "express";
import { CartItemModel } from "../models/cartItemModel";
import { StatusCodes } from "http-status-codes";
import catchError from "http-errors";
import { cartItemValidation } from "../validations/cartItemValidation";

export const cartItemValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cartItemModel = req.body as CartItemModel;

  const { error, value } = cartItemValidation(cartItemModel);

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

