import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your Email Address.")
    .email("Invalid Email Address"),
  password: z
    .string()
    .min(1, "Please enter your Password.")
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]+$/,
      "Password must contain at least 1 lowercase letter, 1 uppercase letter, and 1 special character"
    ),
});

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your Email Address.")
    .email("Invalid Email Address")
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Please enter your Password.")
      .min(8, "Password must be at least 8 characters long.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]+$/,
        "Password must contain at least 1 lowercase letter, 1 uppercase letter, and 1 special character."
      ),
      confirmPassword: z.string().min(1, "Please confirm your Password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const addUserSchema = z
.object({
  email: z
    .string()
    .min(1, "Please enter your Email.")
    .email("Invalid email address."),
  name: z
    .string()
    .min(1, "Please enter your Name.")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces."),
  phone: z
    .string()
    .min(1, "Please enter your Mobile Number.")
    .max(10, "Mobile number must be exactly 10 digits.")
    .regex(/^\d{10}$/, "Mobile number must contain exactly 10 digits."),

  password: z
    .string()
    .min(1, "Please enter your Password.")
    .min(8, "Password must be at least 8 characters long.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]+$/,
      "Password must contain at least 1 lowercase letter, 1 uppercase letter, and 1 special character."
    ),
  cnfPassword: z.string().min(1, "Please confirm your Password."),
  roleId: z.string()
})


export const editUserSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your Email.")
    .email("Invalid email address."),
  name: z
    .string()
    .min(1, "Please enter your Name.")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces."),
  number: z
    .string()
    .min(1, "Please enter your Mobile Number.")
    .max(10, "Mobile number must be exactly 10 digits.")
    .regex(/^\d{10}$/, "Mobile number must contain exactly 10 digits."),
  roleId: z.string()
})