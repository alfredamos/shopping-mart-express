import { Request, Response } from "express";
import catchError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../db/productDb";

const createCategory = async (req: Request, res: Response) => {
  //----> Get new category input from body.
  const { body: newCategory } = req;
  
  //----> Store the new category in the database.
  const createdCategory = await prisma.category.create({
    data: { ...newCategory },
  });

  //----> Send back response.
  res.status(StatusCodes.CREATED).json({ status: "success", createdCategory });
};

const deleteCategory = async (req: Request, res: Response) => {
  //----> Get the category id from params.
  const { id } = req.params;

  //----> Check the existence of the category in the database.
  const category = await prisma.category.findUnique({ where: { id } });

  //----> Throw error for non existence category.
  if (!category) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `Category with id = ${id} is not found.`
    );
  }

  //----> Delete the category from the database.
  const deletedCategory = await prisma.category.delete({ where: { id } });

  //----> Send back the response.
  res.status(StatusCodes.OK).json({ status: "success", deletedCategory });
};

const getAllCategories = async (req: Request, res: Response) => {
  //----> Get categories from database.
  const categories = await prisma.category.findMany();

  if (!categories || categories.length === 0) {
    throw catchError(StatusCodes.NOT_FOUND, "Categories are empty!");
  }

  //----> Send back response.
  res.status(StatusCodes.OK).json({ status: "success", categories });
};

const getCategoryById = async (req: Request, res: Response) => {
  //----> Get the category id from params
  const { id } = req.params;

  //----> Check for the existence of category in the database.
  const category = await prisma.category.findUnique({ where: { id } });

  //----> Throw error for non existent category.
  if (!category) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `Category with id = ${id} is not found.`
    );
  }

  //----> Send back response.
  res.status(StatusCodes.OK).json({ status: "success", category });
};

const updatedCategory = async (req: Request, res: Response) => {
  //----> Get the category id from params.
  const { id } = req.params;

  //----> Get the category to edit input data from body.
  const { body: categoryToEdit } = req;
  
  //----> Check for the existence of the said category in the database.
  const category = await prisma.category.findUnique({ where: { id } });

  //----> Throw error for non existent category.
  if (!category) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `Category with id = ${id} is not found.`
    );
  }

  //----> Store the edited category in the database.
  const editedCategory = await prisma.category.update({
    where: { id },
    data: { ...categoryToEdit },
  });

  //----> Send back the response.
  res.status(StatusCodes.OK).json({ status: "success", editedCategory });
};

export {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updatedCategory,
};
