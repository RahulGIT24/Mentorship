import { ApiResponse } from "../lib/apiResponse.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { mail } from "../lib/email.js";
import User from "../models/user.model.js";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CookieOptions } from "express";
import { DecodedToken } from "../lib/interfaces.js";
import Notification from "../models/notification.model.js";
// import Connection from "../models/connection.model.js";

const generateAccessandRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (user == null) {
      throw new ApiResponse(
        401,
        "Something went wrong while generating access and refresh token"
      );
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiResponse(
      401,
      "Something went wrong while generating access and refresh token"
    );
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, username, password, email, role } = req.body;
    if (
      [name, email, username, password, role].some(
        (field) => field.trim() === ""
      )
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Please send all the data"));
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
      verificationStatus:true
    }).select("name email username verificationStatus");

    if (existingUser && existingUser?.username === username) {
      throw new ApiResponse(400, null, "Username already taken");
    }
    if (existingUser?.verificationStatus == true) {
      if (existingUser?.email === email) {
        throw new ApiResponse(400, null, "User with this email already exists");
      }
    }

    const verificationTokenExpiration = new Date();
    verificationTokenExpiration.setHours(
      verificationTokenExpiration.getHours() + 1
    );

    const verificationToken = jwt.sign(
      {
        email: email,
      },
      process.env.JWT_SECRET as string
    );

    if (existingUser) {
      existingUser.verificationToken = verificationToken;
      existingUser.verificationTokenExpiration = verificationTokenExpiration;
      await existingUser.save();
      await mail({
        email,
        emailType: "verify",
        url: `${process.env.FRONTEND_URL}/verify-account?token=${verificationToken}`,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            201,
            null,
            "Registered, Please Verify Your Email Address"
          )
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      username,
      password: hashedPassword,
      email,
      verificationToken,
      verificationTokenExpiration,
      role,
    });

    await user.save();
    await mail({
      email,
      emailType: "verify",
      url: `${process.env.FRONTEND_URL}/verify-account?token=${verificationToken}`,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          201,
          null,
          "User Registered please verify your email address"
        )
      );
  } catch (error) {
    if (error instanceof ApiResponse) {
      return res.status(error.statuscode).json(error);
    }
    // Fallback for unhandled errors
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

export const verifyAccount = asyncHandler(async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      throw new ApiResponse(400, null, "Token not found");
    }
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      throw new ApiResponse(400, null, "Invalid token");
    }

    if (user.verificationTokenExpiration) {
      if (user?.verificationTokenExpiration < new Date()) {
        user.verificationToken = undefined;
        user.verificationTokenExpiration = undefined;
        throw new ApiResponse(400, null, "Token expired");
      }
    }

    user.verificationStatus = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiration = undefined;
    await user.save();
    return res.status(200).json(new ApiResponse(200, null, "Account verified"));
  } catch (error) {
    console.log(error);
    if (error instanceof ApiResponse) {
      return res.status(error.statuscode).json(error);
    }
    // Fallback for unhandled errors
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

export const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiResponse(400, null, "Please send all the data");
    }

    const existingUser = await User.findOne({ email: email }).select(
      "-refreshToken"
    );

    if (!existingUser) {
      throw new ApiResponse(404, null, "User not exist");
    }

    if (existingUser.verificationStatus === false) {
      const verificationTokenExpiration = new Date();
      verificationTokenExpiration.setHours(
        verificationTokenExpiration.getHours() + 1
      );

      const verificationToken = jwt.sign(
        {
          email: email,
        },
        process.env.JWT_SECRET as string
      );
      const isMailed = await mail({
        email: existingUser.email,
        emailType: "verify",
        url: `${process.env.FRONTEND_URL}/verify-account?token=${verificationToken}`,
      });
      if (!isMailed) {
        throw new ApiResponse(500, null, "Failed to send verification email");
      }
      existingUser.verificationToken = verificationToken;
      existingUser.verificationTokenExpiration = verificationTokenExpiration;
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
      await existingUser.save();
      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            null,
            "Please Verify Your Email Address. Email Sent"
          )
        );
    }

    const options: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };
    const isCorrect = await existingUser.passwordCompare(password);
    if (!isCorrect) {
      return res
        .status(400)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(401, null, "Invalid Credentials"));
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
      existingUser.id
    );

    const unreadNotifications = await Notification.countDocuments({
      receiver:existingUser.id,
      isRead:false
    })

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            username: existingUser.username,
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            createdAt: existingUser.createdAt,
            verificationStatus: existingUser.verificationStatus,
            role: existingUser.role,
            skills: existingUser.skills || [],
            interest: existingUser.interest || [],
            bio: existingUser.bio || "",
            unreadNotifications
          },
          `Welcome Back`
        )
      );
  } catch (error) {
    console.log(error);
    if (error instanceof ApiResponse) {
      return res.status(error.statuscode).json(error);
    }
    // Fallback for unhandled errors
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ApiResponse(404, null, "Please Provide email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiResponse(400, null, "User not exist");
    }
    if (user.verificationStatus === false) {
      throw new ApiResponse(400, null, "User is not verified");
    }
    const forgotPasswordTokenExpiry = new Date();
    forgotPasswordTokenExpiry.setHours(
      forgotPasswordTokenExpiry.getMinutes() + 30
    );
    const forgotPasswordToken = jwt.sign(
      {
        email: email,
      },
      process.env.JWT_SECRET as string
    );
    user.resetPasswordToken = forgotPasswordToken;
    user.resetPasswordTokenExpiration = forgotPasswordTokenExpiry;
    await user.save();
    const url =
      process.env.FRONTEND_URL + `/reset-password?token=${forgotPasswordToken}`;
    const mailed = await mail({
      email: email,
      url,
      emailType: "forgotpassword",
    });
    if (mailed) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Password Recovery Email Send"));
    }
    throw new ApiResponse(400, null, "Can't send email");
  } catch (error) {
    console.log(error);
    if (error instanceof ApiResponse) {
      return res.status(error.statuscode).json(error);
    }
    // Fallback for unhandled errors
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

export const changePassword = asyncHandler(async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const { token } = req.query;
    if (!token) {
      throw new ApiResponse(404, null, "Token Not Found");
    }
    if (password !== confirmPassword) {
      throw new ApiResponse(400, null, "Passwords do not match");
    }
    const user = await User.findOne({ resetPasswordToken: token });
    if (!user || !user?.resetPasswordTokenExpiration) {
      throw new ApiResponse(400, null, "Invalid Token");
    }
    if (user?.resetPasswordTokenExpiration < new Date()) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiration = undefined;
      await user.save();
      throw new ApiResponse(400, null, "Token Expired");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiration = undefined;
    await user.save();
    return res.status(200).json(new ApiResponse(200, null, "Password Changed"));
  } catch (error) {
    if (error instanceof ApiResponse) {
      return res.status(error.statuscode).json(error);
    }
    // Fallback for unhandled errors
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User logged Out"));
});

export const refreshAllTokens = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiResponse(401, null, "No refresh token provided");
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret
    ) as DecodedToken;
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiResponse(401, null, "Token Expired");
    }
    if (incomingRefreshToken != user?.refreshToken) {
      throw new ApiResponse(404, null, "Invalid Refresh Token");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
      user?.id
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, null, "Access token refreshed"));
  } catch (error) {
    if (error instanceof ApiResponse) {
      return res.status(error.statuscode).json(error);
    }
    // Fallback for unhandled errors
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

