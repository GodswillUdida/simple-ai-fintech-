import bcrypt, { hash } from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/userModel";
import dotenv from "dotenv";
dotenv.config();

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await hash(password, process.env.HASHING_ROUNDS!);
    const user = new User({ username, password: hashedPassword, email });
    await user.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error:any) {
      return res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user: any = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Something went wrong ${error.message}` });
  }
};
