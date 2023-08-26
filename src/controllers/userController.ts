import { prisma } from "../db/productDb";
import catchError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { UuidTool } from "uuid-tool";
import { UserInfo } from "../models/userInfoModel";
import {Request, Response} from "express"

const currentUser = async (req: Request, res: Response) => {
  const userInfo = req["userInfo"] as UserInfo;

  if (!userInfo) {
    throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
  }

  const userId = userInfo?.id;

  const isUuid = UuidTool.isUuid(userId);

  if (!userId || !isUuid) {
    throw catchError(StatusCodes.NOT_FOUND, `User with id = ${userId}`);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      gender: true,
    },
  });

  if (!user) {
    throw catchError(StatusCodes.NOT_FOUND, `User with id = ${userId}`);
  }

  //----> Send the response.
  res.status(StatusCodes.OK).json(user);
};

const deleteUserByEmail = async (req: Request, res: Response) => {
  //----> Destructure email and password from the request body.
  const { email } = req.body;

  //---> Check for the existence of user.
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `User with email : ${email}is not found!`
    );
  }

  //----> Delete the user with the above given email from the database.
  const deletedUser = await prisma.user.delete({ where: { email } });

  //----> Send back the response.
  res.status(StatusCodes.OK).json({
    status: "Success",
    message: `User with email : ${email} deleted successfully!`,
    deleteUser,
  });
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  //----> Check for the existence of user.
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `The user with id = ${id} does not exist!`
    );
  }

  //----> Remove the user from database.
  const deletedUser = await prisma.user.delete({ where: { id } });

  //----> Send response to the admin.
  res.status(StatusCodes.OK).json({
    message: "User has been successfully removed!",
    user: deletedUser,
  });
};

const getAllUsers = async (req: Request, res: Response) => {
  //----> Get all users from database.
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      gender: true,
      role: true,
    },
  });

  //----> Check for availability of users
  if (!users) {
    throw catchError(StatusCodes.NOT_FOUND, "No user in the database");
  }

  //----> Send back the response.
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Users are fetched successfully!",
    users,
  });
};

const getOneUser = async (req: Request, res: Response) => {
  //----> Get user id from params.
  const { id } = req.params;

  //----> Get the user from database.
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      gender: true,
      role: true,
    },
  });

  //----> Check for existence of user.
  if (!user) {
    throw catchError(
      StatusCodes.NOT_FOUND,
      `The user with id = ${id} is not found in the database!`
    );
  }

  //----> Send back the response.
  res
    .status(StatusCodes.OK)
    .json({ message: "The user is fetched success", user });
};

export {
  currentUser,
  deleteUser,
  deleteUserByEmail,
  getAllUsers, 
  getOneUser
}