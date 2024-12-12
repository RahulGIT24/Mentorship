import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../lib/interfaces";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { string } from "zod";

const userSchema = new Schema<IUser & Document>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: { type: String, enum: ['mentor', 'mentee'], required: true },
  name: {
    type: String,
    required: true,
  },
  refreshToken: String,
  username: {
    type: String,
    required: true,
    unique: true,
  },
  verificationStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordTokenExpiration: Date,
  skills:[String],
  interest:[String],
  bio:String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  verificationToken: String,
  verificationTokenExpiration: Date,
});

userSchema.methods.passwordCompare = async function (password: string) {
  const res = await bcrypt.compare(password, this.password);
  return res;
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      name: this.name,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model<IUser & Document>("User", userSchema);
export default User;
