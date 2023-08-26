import Joi from "joi";
import { CartItemModel } from "../models/cartItemModel";

const cartItemValidationSchema = Joi.object({
  id: Joi.string().optional(),
  orderId: Joi.string().optional(),
  productId: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required()
});

export const cartItemValidation = (cartItemModel: CartItemModel) => {
  const { id, orderId, price, productId, quantity } = cartItemModel;

  return cartItemValidationSchema.validate({ id, orderId, price, productId, quantity }, { abortEarly: false });
};
