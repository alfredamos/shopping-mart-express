import { Request, Response } from "express";
import catchError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../db/productDb";
import { CartItemModel } from "../models/cartItemModel";

const createCartItem = async (req: Request, res: Response) => {
  //----> Get new cartItem input from body.
  const { body: newCartItem } = req;
  const { productId } = req.body as CartItemModel;

  //----> Retrieve the product attach to cartItem.
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `The product with id : ${productId} is not found in the database!`
    );
  }

  //----> Store the new cartItem in the database.
  const createdCartItem = await prisma.cartItem.create({
    data: { ...newCartItem },
  });

  //----> Send back response.
  res.status(StatusCodes.CREATED).json(createdCartItem);
};

const deleteCartItem = async (req: Request, res: Response) => {
  //----> Get the cartItem id from params.
  const { id } = req.params;

  //----> Check the existence of the cartItem in the database.
  const cartItem = await prisma.cartItem.findUnique({ where: { id } });

  //----> Throw error for non existence cartItem.
  if (!cartItem) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `CartItem with id = ${id} is not found.`
    );
  }

  //----> Delete the cartItem from the database.
  const deletedCartItem = await prisma.cartItem.delete({ where: { id } });

  //----> Send back the response.
  res.status(StatusCodes.OK).json(deletedCartItem);
};

const getAllCartItems = async (req: Request, res: Response) => {
  //----> Get cartItems from database.
  const cartItems = await prisma.cartItem.findMany({
      select: {
        id: true,
        quantity: true,
        price: true,
        productId: true,
        order: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
                gender: true,
              },
            },
            id: true,
          },
        },
        product: {
          select: {
            name: true,
            brand: true,
            price: true,
          },
        },
      },  });

  if (!cartItems || cartItems.length === 0) {
    throw catchError(StatusCodes.NOT_FOUND, "CarItems are empty! ");
  }

  //----> Send back response.
  res.status(StatusCodes.OK).json(cartItems);
};

const getCartItemById = async (req: Request, res: Response) => {
  //----> Get the cartItem id from params
  const { id } = req.params;

  //----> Check for the existence of cartItem in the database.
  const cartItem = await prisma.cartItem.findUnique({
    where: { id },
    select: {
      id: true,
      quantity: true,
      price: true,
      productId: true,
      order: {
        select: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              gender: true,
            },
          },
          id: true,
        },
      },
      product: {
        select: {
          name: true,
          brand: true,
          price: true,
        },
      },
    },
  });

  //----> Throw error for non existent cartItem.
  if (!cartItem) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `CartItem with id = ${id} is not found.`
    );
  }

  //----> Send back response.
  res.status(StatusCodes.OK).json(cartItem);
};

const updatedCartItem = async (req: Request, res: Response) => {
  //----> Get the cartItem id from params.
  const { id } = req.params;
  const { productId } = req.body as CartItemModel;

  //----> Retrieve the product attach to cartItem.
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `The product with id : ${productId} is not found in the database!`
    );
  }

  //----> Get the cartItem to edit input data from body.
  const { body: cartItemToEdit } = req;

  //----> Check for the existence of the said cartItem in the database.
  const cartItem = await prisma.cartItem.findUnique({ where: { id } });

  //----> Throw error for non existent cartItem.
  if (!cartItem) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `CartItem with id = ${id} is not found.`
    );
  }

  //----> Store the edited cartItem in the database.
  const editedCartItem = await prisma.cartItem.update({
    where: { id },
    data: { ...cartItemToEdit },
  });

  //----> Send back the response.
  res.status(StatusCodes.OK).json(editedCartItem);
};

export {
  createCartItem,
  deleteCartItem,
  getAllCartItems,
  getCartItemById,
  updatedCartItem,
};
