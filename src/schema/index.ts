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

  export const projectSchema = z.object({
    projectName: z.string().min(3, { message: "Project Name must be at least 3 characters long" }),
    projectTech: z.array(z.string()).min(1, { message: "At least one technology must be selected" }),
    projectStartAt: z.date().nullable().refine((date) => date !== null, { message: "Start date is required" }),
    projectDeadline: z.date().nullable().refine((date) => date !== null, { message: "Deadline date is required" }),
    projectLead: z.string().min(1, { message: "Project Lead is required" }),
    teamSize: z.number().min(1, { message: "Team size must be at least 1" }),
    projectClient: z.string().min(1, { message: "Project Client is required" }),
    projectManagementTool: z.string().min(1, { message: "Project Management Tool is required" }),
    projectManagementUrl: z.string().url({ message: "Provide a valid URL for Project Management" }),
    projectDescription: z.string().min(10, { message: "Description must be at least 10 characters long" }),
    projectRepoTool: z.string().min(1, { message: "Project Repo Tool is required" }),
    projectRepoUrl: z.string().url({ message: "Provide a valid URL for Project Repo" }),
    projectStatus: z.enum(['Planning', 'Requirements Gathering', 'In Progress', 'Development', 'Testing', 'Production']),
  });


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