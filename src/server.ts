// src/server.ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
// import brain from 'brain.js';
import * as brain from 'brain.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

app.get('/', (req: Request, res: Response) => {
 return res.send('Welcome to the AI-powered Fintech Platform');
});

const net = new brain.NeuralNetwork();

// Train the network with some data
net.train([
  { input: [0, 0], output: [0] },
  { input: [0, 1], output: [1] },
  { input: [1, 0], output: [1] },
  { input: [1, 1], output: [0] },
]);

app.post('/predict', (req: Request, res: Response) => {
  const { input } = req.body;
  const output = net.run(input);
  res.json({ output });
});

app.listen(port, () => {
  console.log()
  console.log(`Server is running on port ${port}`);
});