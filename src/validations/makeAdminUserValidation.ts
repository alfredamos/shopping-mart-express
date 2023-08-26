import Joi from "joi";
import { MakeAdminUserModel } from "../models/makeAdminUserModel";

const makeAdminUserValidationSchema = Joi.object({
  email: Joi.string().optional().email(),
  name: Joi.string().optional(),
  phone: Joi.string().optional(), 
  gender: Joi.optional(),
  role: Joi.optional(),
});

export const makeAdminUserValidation = (
  makeAdminUserModel: MakeAdminUserModel
) => {
  const { name, email, phone, gender, role } = makeAdminUserModel;

  return makeAdminUserValidationSchema.validate(
    {
      name,
      email,
      phone,  
      gender,
    },
    { abortEarly: false }
  );
};
