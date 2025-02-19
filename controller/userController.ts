// import { compare } from "bcrypt";
import { Request, Response } from "express";
import User from "../model/userModel";
import dotenv from "dotenv";
import { generateRefreshToken, generateToken } from "../config/jwtHelper";
dotenv.config();
import { hash, verify } from "argon2";

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await hash(password);
    console.log("Hashed Password:", hashedPassword);

    const user = new User({ username, password: hashedPassword, email });
    await user.save();

    const secureUser = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    return res
      .status(201)
      .json({ message: "User registered successfully", data: secureUser });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Something went wrong: ${error.message}` });
  }
};

export const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user: any = await User.findOne({ email });
    console.log("user", user);
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    console.log("Stored Hashed Password:", user.password);
    console.log("Entered Password:", password);

    const isPasswordValid = await verify(user.password, password);
    console.log("Password Match:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
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

    return res.json({
      message: "User signed in successfully",
      userData: { username: user.username, email: user.email },
      token: token,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Something went wrong: ${error.message}` });
  }
};

export const getUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("_id username email").lean();

    const secureUser = {
      id: user?._id,
      username: user?.username,
      email: user?.email,
    };

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ data: secureUser });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Something went wrong: ${error.message}` });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await User.find().select("_id username email").lean();
    return res.json({ data: users });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Something went wrong: ${error.message}` });
  }
};

export const deleteAllUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    await User.deleteMany();
    return res.json({ message: "All users deleted successfully" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Something went wrong: ${error.message}` });
  }
};
