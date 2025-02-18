import { compare, hash } from "bcrypt";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import User from "../model/userModel";
import dotenv from "dotenv";
dotenv.config();

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await hash(
      password,
      parseInt(process.env.SALT_ROUNDS!)
    );

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

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user: any = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const token = sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Something went wrong: ${error.message}` });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user: any = await User.findById(id);

    const secureUser = {
      id: user._id,
      username: user.username,
      email: user.email,
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
