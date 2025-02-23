import { NextFunction, Request, Response } from "express";
// import { verify } from "jsonwebtoken";
import { verifyToken } from "../config/jwtHelper";
import { errorResponse } from "../config/responseHelper";

export const authMiddleware = (req: Request | any, res: Response, next: NextFunction) => {
  
 const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
   return errorResponse(res,"Unauthorized, no token provided", 401);
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
    return errorResponse(res, "Invalid or expired token", 401);
  }
};
