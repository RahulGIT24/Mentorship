import { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  refreshToken?: string;
  username: string;
  verificationStatus: boolean;
  resetPasswordToken?: string;
  resetPasswordTokenExpiration?: Date;
  createdAt: Date;
  updatedAt?: Date;
  verificationToken?: string;
  verificationTokenExpiration?: Date;

  // Custom methods
  passwordCompare(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IApiResponse<T = any> {
  statuscode: number; // HTTP status code
  data: T; // Generic type for data payload
  message: string; // Optional message
}

export interface DecodedToken {
  _id: string;
}
