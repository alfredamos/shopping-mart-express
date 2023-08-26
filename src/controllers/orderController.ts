import { Request, Response } from "express";
import catchError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../db/productDb";
import {CartItem} from "@prisma/client"
import { OrderModel } from "../models/orderModel";

const createOrder = async (req: Request, res: Response) => {
  //----> Destructure cart items from the createOrderDto
  const { cartItems, ...rests } = req.body as OrderModel;

  //----> Retrieve the user attached to this order
  const user = await prisma.user.findUnique({ where: { id: rests?.userId } });

  //---> Check for the existence of user.
  if (!user) {
    throw catchError(StatusCodes.NOT_FOUND,
      `The user with userId = ${rests?.userId} doesn't exist in the database!`
    );
  }

  //----> Aggregate the total price of all cart items.
  rests.total = totalPrice(cartItems);
  rests.items = totalNumberOfItems(cartItems);

  //----> Create an order.
  const order = await prisma.order.create({
    data: {
      ...rests,
      cartItems: {
        createMany: {
          data: [...cartItems],
        },
      },
    },
    include: {
      cartItems: true,
    },
  });

  //----> Send back response.
  res.status(StatusCodes.CREATED).json({ status: "success", order });
};

const deleteOrder = async (req: Request, res: Response) => {
  //----> Get the order id from params.
  const { id } = req.params;

  //----> Retrieve the order.
  const order = await prisma.order.findUnique({ where: { id } });

  //----> Check for existence of order.
  if (!order) {
    throw catchError(StatusCodes.NOT_FOUND,
      `The order with id : ${id} is not found in the database!`
    );
  }

  //----> Delete the cart items from the database.
  await prisma.order.update({
    where: {
      id,
    },
    data: {
      cartItems: {
        deleteMany: {},
      },
    },
    include: {
      cartItems: true,
    },
  });

  //----> Delete the order.
  const deletedOrder = await prisma.order.delete({ where: { id } });
  
  //----> Send back the response.
  res.status(StatusCodes.OK).json({ status: "success", deletedOrder });
};

const getAllOrders = async (req: Request, res: Response) => {
  //----> Get orders from database.
  const orders = await prisma.order.findMany();

  if (!orders || orders.length === 0) {
    throw catchError(StatusCodes.NOT_FOUND, "Orders are empty!");
  }

  //----> Send back response.
  res.status(StatusCodes.OK).json({ status: "success", orders });
};

const getOrderById = async (req: Request, res: Response) => {
  //----> Get the order id from params
  const { id } = req.params;

  //----> Check for the existence of order in the database.
  const order = await prisma.order.findUnique({ where: { id } });

  //----> Throw error for non existent order.
  if (!order) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `Order with id = ${id} is not found.`
    );
  }

  //----> Send back response.
  res.status(StatusCodes.OK).json({ status: "success", order });
};

const updatedOrder = async (req: Request, res: Response) => {
  //----> Get the order id from params.
  const { id } = req.params;

  //----> Destructure the payload.
  const { cartItems, ...rests } = req.body as OrderModel;

  //----> Retrieve the user attached to this order
  const user = await prisma.user.findUnique({ where: { id: rests?.userId } });

  //---> Check for the existence of user.
  if (!user) {
    throw catchError(StatusCodes.NOT_FOUND,
      `The user with userId = ${rests?.userId} doesn't exist in the database!`
    );
  }

  //----> Retrieve the order.
  const order = await prisma.order.findUnique({ where: { id } });

  //----> Check for existence of order.
  if (!order) {
    throw catchError(StatusCodes.NOT_FOUND, `The order with id : ${id} is not found in the database!`);
  }

  //----> Update cart items.
  updateCartItems(cartItems);

  //----> Aggregate the total price of all cart items.
  rests.total = totalPrice(cartItems);
  rests.items = totalNumberOfItems(cartItems);

  //----> Update the order in the database.
  await prisma.order.update({
    where: { id },
    data: {
      ...rests,
    },
  });

  //----> Retrieve the latest updated order.
  const updatedOrder = await prisma.order.findUnique({
    where: { id },
    include: { cartItems: true },
  });
 
  //----> Send back the response.
  res.status(StatusCodes.OK).json({ status: "success", updatedOrder });
};

function totalPrice(cartItems: CartItem[]) {
  return cartItems.reduce(
    (prev, cartItem) => Number(cartItem.price) * cartItem.quantity + prev,
    0,
  );
}

function totalNumberOfItems(cartItems: CartItem[]) {
  return cartItems.reduce(
    (prev, cartItem) => Number(cartItem.quantity) + prev,
    0,
  );
}

function updateCartItems(cartItems: CartItem[]) {
    return cartItems.map(async (item) => {
      return await this.prisma.cartItem.update({
      where: { id: item.id },
      data: { ...item },
    });
  });
}

export {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updatedOrder,
};
