import { Request, Response } from "express";
import User from "../model/userModel";
import dotenv from "dotenv";
import { generateRefreshToken, generateToken } from "../config/jwtHelper";
dotenv.config();
import { hash, verify } from "argon2";
import { errorResponse, successResponse } from "../config/responseHelper";

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "Email is already registered", 400,);
    }

    const hashedPassword = await hash(password);

    const user = new User({ username, password: hashedPassword, email });
    await user.save();

    const secureUser = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    return successResponse(res, secureUser, "User Account Created successfully");
  } catch (error: any) {
    return errorResponse(res, error.message, 500, error);
  }
};

export const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user: any = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, "Invalid Email", 404);
    }

    const isPasswordValid = await verify(user.password, password);

    if (!isPasswordValid) {
      return errorResponse(res, "Incorrect Password", 404);
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return successResponse(
      res,
      { id: user._id, userName: user.username, email: user.email, token },
      "User Signed In successfully"
    );
  } catch (error: any) {
    return errorResponse(res, error.message, 500, error);
  }
};

export const getUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password").lean();

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, user, "User retrieved successfully");
  } catch (error: any) {
    return errorResponse(res, error.message, 500, error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await User.find().select("_id username email").lean();
    return successResponse(res, users, "Users retrieved successfully");
  } catch (error: any) {
    return errorResponse(res, error.message, 500, error);
  }
};

export const deleteAllUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    await User.deleteMany();
    return successResponse(res, "All User Deleted successfully");
  } catch (error: any) {
    return errorResponse(res, error.message, 500, error);
  }
};
