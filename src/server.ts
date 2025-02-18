// src/server.ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
// import brain from 'brain.js';
import * as brain from 'brain.js';
import routing from "../router/userRouter";
import { dataBase } from '../config/database';
import { authMiddleware } from '../middleware/authMiddleware';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use("/api",routing);

app.get('/', (req: Request, res: Response) => {
 try {
  return res.status(200).json("Welcome to the AI-powered Fintech Platform");
 } catch (error:any) {
  return res.status(200).json({
    message: "Error Accessing the Fintech Platform",
    error: error.message,
  });
 }
});

const net= new brain.NeuralNetwork();

net.train([
  { input: [0, 0], output: [0] },
  { input: [0, 1], output: [1] },
  { input: [1, 0], output: [1] },
  { input: [1, 1], output: [0] },
  { input: [0.5, 0.5], output: [0.5] },
  { input: [0.2, 0.8], output: [0.8] },
  { input: [0.8, 0.2], output: [0.8] },
]);

app.post('/predict', authMiddleware, (req: Request, res: Response) => {
  const { input } = req.body;
  const output = net.run(input);
  return res.json({ output });
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  return res.status(500).json({ message: 'Something went wrong!' });
});

const liveServer = app.listen(port, () => {
  console.log()
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