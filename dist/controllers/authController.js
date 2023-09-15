"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.signup = exports.updateUserRole = exports.login = exports.changePassword = void 0;
const productDb_1 = require("../db/productDb");
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_tool_1 = require("uuid-tool");
const jwt = __importStar(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    //----> Check the existence of user.
    const user = yield productDb_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials!");
    }
    //----> Check the equality of new password and confirm password.
    if (confirmPassword.normalize() !== newPassword.normalize()) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "New password must match confirm password!");
    }
    //----> Check for the correctness of the user password.
    const hashedPassword = user.password;
    const isValidPassword = yield bcryptjs_1.default.compare(oldPassword, hashedPassword);
    if (!isValidPassword) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials!");
    }
    //----> Hash the new password.
    const newPasswordHashed = yield bcryptjs_1.default.hash(newPassword, 12);
    //----> Insert the new password in the database.
    const updatedUserInfo = yield productDb_1.prisma.user.update({
        where: { email },
        data: Object.assign(Object.assign({}, user), { password: newPasswordHashed }),
    });
    //----> Get jwt token.
    const token = yield getJwtToken(updatedUserInfo.id, updatedUserInfo.name, updatedUserInfo.role);
    //----> Send response to user.
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "password updated successfully!",
        isLoggedIn: true,
        token,
    });
});
exports.changePassword = changePassword;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    //----> Check the authenticity of the user.
    const user = yield productDb_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials!");
    }
    //----> Check for the correctness of the user password.
    const hashedPassword = user.password;
    const isValidPassword = yield bcryptjs_1.default.compare(password, hashedPassword);
    if (!isValidPassword) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials!");
    }
    delete user.password; //----> Do not send back the password;
    //---> Get jwt token.
    const token = yield getJwtToken(user.id, user.name, user.role);
    //----> Send back the response to user.
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({
        message: "Login is successful!",
        isLoggedIn: true,
        token,
        role: user.role,
        user,
    });
});
exports.login = login;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //----> Get user credentials.
    const userInfo = req["userInfo"];
    //----> Check for authentication.
    if (!userInfo) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }
    const userId = userInfo === null || userInfo === void 0 ? void 0 : userInfo.id;
    const isUuid = uuid_tool_1.UuidTool.isUuid(userId);
    //----> Check for validity of id.
    if (!userId || !isUuid) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }
    //----> Check for admin rights.
    const isAdmin = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.role) === client_1.Role.Admin;
    if (!isAdmin) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not permitted to perform this task!");
    }
    //----> Get the email and user details of person to be made admin.
    const { email: userEmail, role } = req.body;
    const user = yield productDb_1.prisma.user.findUnique({ where: { email: userEmail } });
    //----> Check if user exist.
    if (!user) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "This user is not in the database!");
    }
    //----> Make the user an admin.
    const userUpdated = yield productDb_1.prisma.user.update({
        where: { email: userEmail },
        data: Object.assign(Object.assign({}, user), { role }),
    });
    delete userUpdated.password; //----> Do not send back the password.
    //----> Send back the response.
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: `The user with email = ${userUpdated.email} is now an admin!`,
        userUpdated,
    });
});
exports.updateUserRole = updateUserRole;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { email, password, confirmPassword } = _a, signup = __rest(_a, ["email", "password", "confirmPassword"]);
    //----> Check for the existence of the user.
    const user = yield productDb_1.prisma.user.findUnique({ where: { email } });
    if (user) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "User already exist!");
    }
    //----> Check the equality of password and confirmPassword.
    if (password.normalize() !== confirmPassword.normalize()) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password must match confirm password!");
    }
    //----> Encrypt the password.
    const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
    //----> Save the new user in the database.
    const newUser = yield productDb_1.prisma.user.create({
        data: Object.assign(Object.assign({}, signup), { email, password: hashedPassword }),
    });
    //---> Get jwt token.
    const token = yield getJwtToken(newUser.id, newUser.name, newUser.role);
    delete newUser.password; //----> Do not send back the password.
    //----> Send back the response to user.
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({
        message: "Signup is successful!",
        isLoggedIn: true,
        token,
        newUser,
    });
});
exports.signup = signup;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _b = req.body, { email, password } = _b, editedProfile = __rest(_b, ["email", "password"]);
    //----> Check for the existence of user.
    const user = yield productDb_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials!");
    }
    //----> Check for the correctness of the user password.
    const hashedPassword = user.password;
    const isValidPassword = yield bcryptjs_1.default.compare(password, hashedPassword);
    if (!isValidPassword) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials!");
    }
    //----> Insert the edited profile info of the user in the database.
    const editedUserInfo = yield productDb_1.prisma.user.update({
        where: { email },
        data: Object.assign(Object.assign({}, editedProfile), { id: user.id, email: user.email, password: hashedPassword }),
    });
    //----> Get the jwt token.
    const token = yield getJwtToken(editedUserInfo.id, editedUserInfo.name, editedUserInfo.role);
    delete editedUserInfo.password; //----> Do not send back the password.
    //----> Send the response to the user.
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({
        message: "Profile updated successfully",
        isLoggedIn: true,
        token,
        editedUserInfo,
    });
});
exports.updateProfile = updateProfile;
function getJwtToken(id, name, role) {
    return __awaiter(this, void 0, void 0, function* () {
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        return jwt.sign({ id, name, role }, JWT_SECRET_KEY, { expiresIn: "1hr" });
    });
}
