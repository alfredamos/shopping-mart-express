import Joi from "joi";
import { ProductModel } from "../models/productModel";

const productValidationSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().required(),
  price: Joi.number().required(), 
  quantity: Joi.number().required(), 
  rating: Joi.number().optional(),
  description: Joi.number().optional(),
  productImage: Joi.number().optional(),
  brand: Joi.string().required(),
  categoryId: Joi.string().required(),
  
}, );

export const productValidation = (productModel: ProductModel) => {
  const { id, name, price, rating, brand, categoryId, description, quantity, productImage } = productModel;

  return productValidationSchema.validate({
    id,
    brand,
    categoryId,
    description,
    name,
    price,   
    rating,
    productImage,
    quantity   
  },{abortEarly: false});
};
