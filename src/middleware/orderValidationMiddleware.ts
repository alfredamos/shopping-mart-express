import { Request, Response, NextFunction } from "express";
import { OrderModel } from "../models/orderModel";
import { StatusCodes } from "http-status-codes";
import catchError from "http-errors";
import { orderValidation } from "../validations/orderValidation";

export const orderValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderModel = req.body as OrderModel;

  const { error, value } = orderValidation(orderModel);

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

