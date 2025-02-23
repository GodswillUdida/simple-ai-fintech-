// src/server.ts
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import * as brain from "brain.js";
import routing from "../router/userRouter";
import { dataBase } from "../config/database";
import { authMiddleware } from "../middleware/authMiddleware";
import dotenv from "dotenv";
import { errorResponse, successResponse } from "../config/responseHelper";
import morgan from "morgan";
dotenv.config();

const app = express();
const port: string | number = process.env.PORT!;
const realPort = parseInt(port);

app.use(morgan("combined"));
app.use(
  cors({
    // origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(bodyParser.json());
app.use(helmet());
app.use("/api", routing);

app.get("/", (req: Request, res: Response) => {
  try {
    return successResponse(
      res,
      "Welcome to the AI-powered Fintech Platform",
    );
  } catch (error: any) {
    return errorResponse(res, "Error Accessing the Fintech Platform",500,error.message);
  }
});

const net = new brain.NeuralNetwork();

net.train([
  { input: [0, 0], output: [0] },
  { input: [0, 1], output: [1] },
  { input: [1, 0], output: [1] },
  { input: [1, 1], output: [0] },
  { input: [0.5, 0.5], output: [0.5] },
  { input: [0.2, 0.8], output: [0.8] },
  { input: [0.8, 0.2], output: [0.8] },
]);

app.post("/predict", authMiddleware, (req: Request, res: Response) => {
  const { input } = req.body;
  const output = net.run(input);
  return res.json({ output });
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  next();
  return errorResponse(res, "Something went wrong!", 500);
});

const liveServer = app.listen(realPort, () => {
  console.log();
  dataBase();
});

process.on("uncaughtException", (error: Error) => {
  console.log("Error due to uncaughtException:", error.message);
});

process.on("unhandledRejection", (reason: any) => {
  liveServer.close(() => {
    console.log("Error due to unhandledRejection:", reason.message);
  });
});

