# AI-Powered Fintech Platform

This project is an AI-powered fintech platform designed to help MSMEs access financial tools. It includes features such as user authentication, financial predictions using AI, and database integration.

## Table of Contents

1. [Dependencies](#dependencies)
2. [Environment Variables](#environment-variables)
3. [Project Structure](#project-structure)
4. [Usage](#usage)
5. [API Endpoints](#api-endpoints)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)

## Dependencies

- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `body-parser`: Node.js body parsing middleware.
- `cors`: Node.js CORS middleware.
- `helmet`: Helps secure Express apps by setting various HTTP headers.
- `dotenv`: Loads environment variables from a `.env` file into `process.env`.
- `mongoose`: MongoDB object modeling tool designed to work in an asynchronous environment.
- `brain.js`: Neural network library for Node.js.
- `bcrypt`: Library to help hash passwords.
- `jsonwebtoken`: JSON Web Token implementation.

## Environment Variables

Create a `.env` file at the root of your project and add the following variables:
GitHub Copilot
To ensure that only signed-in users can use the AI functionalities, you need to implement authentication middleware that verifies the JWT token before allowing access to the AI endpoint.

Here are the steps to achieve this:

Create Authentication Middleware: This middleware will verify the JWT token.
Protect the AI Endpoint: Use the authentication middleware to protect the /predict endpoint.
1. Create Authentication Middleware
Create a new file authMiddleware.ts in the middleware directory:

2. Protect the AI Endpoint
Update server.ts to use the authentication middleware for the /predict endpoint:

3. Update userController.ts to Include User ID in Request
Update userController.ts to include the user ID in the request object:

1 vulnerability
4. Update README.md to Reflect Changes
Update the documentation to include instructions on how to use the AI functionalities with authentication.

PORT=3000 MONGO_URI=mongodb://localhost:27017/fintech JWT_SECRET=your_jwt_secret SALT_ROUNDS=10


## Project Structure

fintech-platform/ ├── config/ │ └── database.ts ├── router/ │ └── userRouter.ts ├── src/ │ └── server.ts ├── .env ├── package.json └── tsconfig.json


## Usage

1. **Install dependencies**:
   ```sh
   npm install

2. Run the server:
   npm run start 


## API Endpoints

## Description: Welcome message.
Response: 200 OK

{
  "message": "Welcome to the AI-powered Fintech Platform"
}

## POST /register
Description: Register a new user.
Request Body:

{
  "username": "string",
  "password": "string",
  "email": "string"
}

Response: 201 Created
{
  "message": "User registered successfully"
}

## POST /login
Description: Login a user.
Request Body:

{
  "username": "string",
  "password": "string"
}

<vscode_annotation details='%5B%7B%22title%22%3A%22hardcoded-credentials%22%2C%22description%22%3A%22Embedding%20credentials%20in%20source%20code%20risks%20unauthorized%20access%22%7D%5D'>:</vscode_annotation>Response 200 OK

{
  "token": "jwt_token"
}

## POST /predict
Description: Get financial predictions. Only accessible to authenticated users.

Request Headers:

{
  "Authorization": "Bearer jwt_token"
}


Request Body:

{
  "input": [number, number]
}

Response: 200 OK

{
  "output": [number]
}

## Error Handling
Global Error Handler: Logs errors and returns a 500 Internal Server Error response.

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

## Best Practices
Environment Variables: Store sensitive information such as database URI and JWT secret in environment variables.
Error Handling: Implement proper error handling to avoid application crashes.
Security: Use helmet to set secure HTTP headers and bcrypt to hash passwords.
Database Connection: Ensure a stable connection to the MongoDB database using Mongoose.

## Author
This project was created by Udida Godswill.

Using the AI Model
POST /predict
Description: Get financial predictions using the AI model. Only accessible to authenticated users.
Request Headers:
{
  "Authorization": "Bearer jwt_token"
}

Request Body:
{
  "input": [number, number]
}

Response: 200 OK
{
  "output": [number]
}

Example Usage
To use the AI model, first authenticate by logging in to get a JWT token. Then, send a POST request to /predict with the input data and the JWT token in the Authorization header. For example:
curl -X POST http://localhost:3000/predict -H "Authorization: Bearer jwt_token" -H "Content-Type: application/json" -d '{"input": [0.5, 0.5]}'

The response will contain the predicted output based on the input data.

This setup ensures that only authenticated users can access the AI functionalities.





