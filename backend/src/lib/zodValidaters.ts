import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" }) // Minimum length
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  }) // At least one lowercase
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  }) // At least one uppercase
  .regex(/\d/, { message: "Password must contain at least one number" }) // At least one number
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one special character",
  }); // At least one special character

const usernameSchema = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long" }) // Minimum length
  .max(20, { message: "Username must not exceed 20 characters" }) // Maximum length
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message:
      "Username can only contain letters, numbers, underscores, or dashes",
  }); // Allowed characters

export const userSchema = z.object({
  name: z.string().min(3),
  username: usernameSchema,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: passwordSchema,
  role:z.enum(["mentor","mentee"])
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid Email Address" }),
  password: passwordSchema,
});
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid Email Address" }),
});
export const changePasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
});