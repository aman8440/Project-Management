import dayjs from "dayjs";
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
    projectStartAt: z.date({
      required_error: "Start date is required",
      invalid_type_error: "Invalid start date"
    }),
    projectDeadline: z.date({
      required_error: "Deadline date is required",
      invalid_type_error: "Invalid deadline date"
    }),
    projectLead: z.string().min(1, { message: "Project Lead is required" }),
    teamSize: z.number().min(1, { message: "Team size must be at least 1" }),
    projectClient: z.string().min(1, { message: "Project Client is required" }),
    projectManagementTool: z.string().min(1, { message: "Project Management Tool is required" }),
    projectManagementUrl: z.string().url({ message: "Provide a valid URL for Project Management" }),
    projectDescription: z.string().min(10, { message: "Description must be at least 10 characters long" }),
    projectRepoTool: z.string().min(1, { message: "Project Repo Tool is required" }),
    projectRepoUrl: z.string().url({ message: "Provide a valid URL for Project Repo" }),
    projectStatus: z.enum(['Under Planning', 'Development Started', 'Under Testing', 'Deployed on Dev', 'Live']),
  }).superRefine((data, ctx) => {
    if (data.projectStartAt && data.projectDeadline) {
      if (!dayjs(data.projectDeadline).isAfter(dayjs(data.projectStartAt))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Deadline must be after start date",
          path: ['projectDeadline']
        });
      }
    }
  });

export const DocumentStatusEnum = z.enum(['PROCESSING', 'FAILED', 'PROCESSED']);

export const TemplateProp = z.object({
  id: z.string().optional(),
  document_id: z.string().optional(),
  name: z.string().optional()
});

export const ExtractDetailDataSchema = z.object({
  created_at: z.string().nullable().optional(),
  created_by: z.string().nullable().optional(),
  document_name: z.string().optional(),
  document_path: z.string().optional(),
  extension: z.string().optional(),
  id: z.string().optional(),
  is_data_published: z.boolean().optional(),
  is_deleted: z.boolean().optional(),
  is_template: z.boolean().optional(),
  is_template_apply: z.boolean().optional(),
  processed_at: z.string().nullable().optional(),
  processing_status: DocumentStatusEnum.optional(),
  template: TemplateProp.nullable().optional(),
  textract_data_path: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  updated_by: z.string().nullable().optional(),
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