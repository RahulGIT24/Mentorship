import jwt from "jsonwebtoken";
import { asyncHandler } from "../lib/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../lib/apiResponse.js";
import { Request, Response, NextFunction } from "express";
import { DecodedToken } from "../lib/interfaces.js";

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
          throw new ApiResponse(401,null,"Unauthorized Access");
        }
        
        const decodedToken = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as DecodedToken;
        

      const user = await User.findById(decodedToken._id).select(
        "_id  name username testStarted testCompleted profilePic createdAt"
      );

      if (!user) {
        throw new ApiResponse(401,null,"User not found");
      }

      (req as any).user = user;
      next();
    } catch (error) {
      if (error instanceof ApiResponse) {
        return res.status(error.statuscode).json(error);
      }
      // Fallback for unhandled errors
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Internal Server Error"));
    }
  }
);
