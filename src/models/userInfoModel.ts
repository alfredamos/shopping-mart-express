/* eslint-disable prettier/prettier */
import { Role } from '@prisma/client';

export class UserInfo {
  id: string = "";
  name: string = "";
  role: Role = Role.Customer;
  isLoggedIn?: boolean = false;
  token?: string = "";
  message?: string = "";
}
