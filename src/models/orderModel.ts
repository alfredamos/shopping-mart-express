import { CartItem, Status } from "@prisma/client";

export class OrderModel{
  id: string = "";
  userId: string;
  total?: number = 0;
  items?: number = 0;
  cartItems?: CartItem[] = [];
  status?: Status = Status.Pending;
}