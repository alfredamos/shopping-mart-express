import Joi from "joi";
import { OrderStatusModel } from "../models/orderStatusModel";

const orderStatusValidationSchema = Joi.object({ 
  status: Joi.string().required(),
});

export const orderStatusValidation = (orderStatusModel: OrderStatusModel) => {
  const { status } = orderStatusModel;

  return orderStatusValidationSchema.validate(
    { status },
    { abortEarly: false }
  );
};
