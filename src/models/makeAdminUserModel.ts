/* eslint-disable prettier/prettier */
import { Gender, Role } from '@prisma/client';

export class MakeAdminUserModel {
  name: string = "";
  email: string = "";
  phone: string = "";
  gender: Gender = Gender.Male;
  role: Role = Role.Customer;
}
