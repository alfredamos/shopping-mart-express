/* eslint-disable prettier/prettier */
import { User } from './userModel';

export class SignupModel extends User {
  confirmPassword: string = "";
}
