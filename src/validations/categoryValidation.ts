import Joi from "joi";
import { CategoryModel } from "../models/categoryModel";

const categoryValidationSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().required(),
});

export const categoryValidation = (categoryModel: CategoryModel) => {
  const { id, name } = categoryModel;

  return categoryValidationSchema.validate(
    { id, name },
    { abortEarly: false }
  );
};
