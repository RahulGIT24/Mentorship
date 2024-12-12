import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

// Middleware for API Data validation

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void | Promise<void> => {
    try {
      schema.parse(req.body); // Perform validation
      next(); // Proceed if validation passes
    } catch (error:any) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors, // Include Zod error details
      });
    }
  };
};
