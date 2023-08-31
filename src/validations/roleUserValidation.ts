import Joi from "joi";
import { RoleUserModel } from "../models/roleUserModel";

const roleUserValidationSchema = Joi.object({
  email: Joi.string().optional().email(),
  name: Joi.string().optional(),
  phone: Joi.string().optional(),
  gender: Joi.optional(),
  role: Joi.optional(),
});

export const roleUserValidation = (
  roleUserModel: RoleUserModel
) => {
  const { name, email, phone, gender, role } = roleUserModel;

  return roleUserValidationSchema.validate(
    {
      name,
      email,
      phone,
      gender,
    },
    { abortEarly: false }
  );
};
