import { prisma } from "../db/productDb";
import { Request, Response } from "express";
import catchError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { ProductModel } from "../models/productModel";

const createProduct = async (req: Request, res: Response) => {
  //----> Get new product input from body.
  const { body: newProduct } = req;
  const { categoryId } = req.body as ProductModel;

  //----> Retrieve the product category.
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `Category with id : ${categoryId} is not found in the database!`
    );
  }

  //----> Store the new product in the database.
  const product = await prisma.product.create({
    data: { ...newProduct },
  });

  //----> Send back response.
  res.status(StatusCodes.CREATED).json(product);
};

const deleteProduct = async (req: Request, res: Response) => {
  //----> Get the product id from params.
  const { id } = req.params;

  //----> Check the existence of the product in the database.
  const product = await prisma.product.findUnique({ where: { id } });

  //----> Throw error for non existence product.
  if (!product) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `Product with id = ${id} is not found.`
    );
  }

  //----> Delete the product from the database.
  const deletedProduct = await prisma.product.delete({ where: { id } });

  //----> Send back the response.
  res.status(StatusCodes.OK).json(deletedProduct);
};

const getAllProducts = async (req: Request, res: Response) => {
  //----> Get products from database.
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: { name: true },
      },
    },
  });

  if (!products || products.length === 0) {
    throw catchError(StatusCodes.NOT_FOUND, "Products are empty!");
  }

  //----> Send back response.
  res.status(StatusCodes.OK).json(products);
};

const getProductById = async (req: Request, res: Response) => {
  //----> Get the product id from params
  const { id } = req.params;

  //----> Check for the existence of product in the database.
  const product = await prisma.product.findUnique({ where: { id }, include: {category: {select: {name: true}}} });

  //----> Throw error for non existent product.
  if (!product) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `Product with id = ${id} is not found.`
    );
  }

  //----> Send back response.
  res.status(StatusCodes.OK).json(product);
};

const getProductsByCategoryId = async (req: Request, res: Response) => {
  //----> Extract the category id from params.
  const { categoryId } = req.params;

  //----> Get products by category id.
  const products = await prisma.product.findMany({ where: { categoryId }, include: {category: {select: {name: true}}} });

  //----> Check for existence of products.
  if (!products || products.length === 0) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `Products with categoryId : ${categoryId} is available in the database!`
    );
  }

  //----> Send back the respond.
  res.status(StatusCodes.OK).json(products);
};

const updatedProduct = async (req: Request, res: Response) => {
  //----> Get the product id from params.
  const { id } = req.params;

  //----> Get the product to edit input data from body.
  const { body: productToEdit } = req;
  const { categoryId } = req.body as ProductModel;

  //----> Retrieve the product category.
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `Category with id : ${categoryId} is not found in the database!`
    );
  }

  //----> Check for the existence of the said product in the database.
  const product = await prisma.product.findUnique({ where: { id } });

  //----> Throw error for non existent product.
  if (!product) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `Product with id = ${id} is not found.`
    );
  }

  //----> Store the edited product in the database.
  const editedProduct = await prisma.product.update({
    where: { id },
    data: { ...productToEdit },
  });

  //----> Send back the response.
  res.status(StatusCodes.OK).json(editedProduct);
};

export {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  updatedProduct,
};
