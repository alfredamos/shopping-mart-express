import { StatusCodes } from "http-status-codes";
import catchError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { OrderStatusModel } from "../models/orderStatusModel";
import { orderStatusValidation } from "../validations/orderStatusValidation";

export const orderStatusValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderStatusModel = req.body as OrderStatusModel;

  const { error, value } = orderStatusValidation(orderStatusModel);

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
