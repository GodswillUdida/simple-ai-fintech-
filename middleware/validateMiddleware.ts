import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "Joi";

export const validateSchema =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation Error",
        errors: error.details.map((err) => ({
          message: err.message,
          field: err.path.join("."),
          messages: err.message.replace(/['"]/g, ""),
        })),
      });
    }

    next();
  };
