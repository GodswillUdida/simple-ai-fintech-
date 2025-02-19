import { NextFunction, Request, Response } from "express";
// import { verify } from "jsonwebtoken";
import { verifyToken } from "../config/jwtHelper";

export const authMiddleware = (req: Request | any, res: Response, next: NextFunction) => {
  
 const authHeader = req.headers.authorization;

 if (!authHeader || !authHeader.startsWith("Bearer ")) {
   return res.status(401).json({ message: "Unauthorized, no token provided" });
 }


  // const token = req.header("Authorization")?.replace("Bearer ", "");
  // if (!token) {
  //   return res
  //     .status(401)
  //     .json({ message: "Access denied. No token provided." });
  // }

  try {

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    // const decoded = verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
