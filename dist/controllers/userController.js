"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneUser = exports.getAllUsers = exports.deleteUserByEmail = exports.deleteUser = exports.currentUser = void 0;
const productDb_1 = require("../db/productDb");
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const uuid_tool_1 = require("uuid-tool");
const currentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = req["userInfo"];
    if (!userInfo) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials!");
    }
    const userId = userInfo === null || userInfo === void 0 ? void 0 : userInfo.id;
    const isUuid = uuid_tool_1.UuidTool.isUuid(userId);
    if (!userId || !isUuid) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `User with id = ${userId}`);
    }
    const user = yield productDb_1.prisma.user.findUnique({
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
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `User with id = ${userId}`);
    }
    //----> Send the response.
    res.status(http_status_codes_1.StatusCodes.OK).json(user);
});
exports.currentUser = currentUser;
const deleteUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Destructure email and password from the request body.
    const { email } = req.body;
    //---> Check for the existence of user.
    const user = yield productDb_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `User with email : ${email}is not found!`);
    }
    //----> Delete the user with the above given email from the database.
    const deletedUser = yield productDb_1.prisma.user.delete({ where: { email } });
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "Success",
        message: `User with email : ${email} deleted successfully!`,
        deleteUser,
    });
});
exports.deleteUserByEmail = deleteUserByEmail;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //----> Check for the existence of user.
    const user = yield productDb_1.prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `The user with id = ${id} does not exist!`);
    }
    //----> Remove the user from database.
    const deletedUser = yield productDb_1.prisma.user.delete({ where: { id } });
    //----> Send response to the admin.
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "User has been successfully removed!",
        user: deletedUser,
    });
});
exports.deleteUser = deleteUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get all users from database.
    const users = yield productDb_1.prisma.user.findMany({
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
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "No user in the database");
    }
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        message: "Users are fetched successfully!",
        users,
    });
});
exports.getAllUsers = getAllUsers;
const getOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get user id from params.
    const { id } = req.params;
    //----> Get the user from database.
    const user = yield productDb_1.prisma.user.findUnique({
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
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `The user with id = ${id} is not found in the database!`);
    }
    //----> Send back the response.
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ message: "The user is fetched success", user });
});
exports.getOneUser = getOneUser;
