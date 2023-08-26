import Joi from "joi";
import { OrderModel } from "../models/orderModel";

const orderValidationSchema = Joi.object({
  id: Joi.string().optional(),
  userId: Joi.string().required(),
  cartItems: Joi.array().optional()
});

export const orderValidation = (orderModel: OrderModel) => {
  const { id, cartItems, userId } = orderModel;

  return orderValidationSchema.validate({ id, cartItems, userId }, { abortEarly: false });
};
