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

export interface IParsedData{
  skills?:string[],
  interest?:string[],
  page?:number,
  role?:string
}

export const validateQuery = (schema: ZodSchema) => {
  return (req: any, res: Response, next: NextFunction): void | Promise<void> => {
    try {
      let parsedData:IParsedData = {
        page:req.query.page as number
      }
      if(req.query.skills){
        parsedData.skills = req.query.skills.split(',')
      }
      if(req.query.interest){
        parsedData.interest = req.query.interest.split(',')
      }
      if(req.query.role){
        parsedData.role = req.query.role
      }
      schema.parse(parsedData); // Perform validation
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
