import { z } from "zod";

const createUserZodSchema = z.object({
  body: z.object({
    role: z
      .string({
        required_error: "Role is required",
      })
      .default("user"),
    fullName: z.string({
      required_error: "First name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    phone: z.string().optional(),
    address: z.string().optional(),
    zipCode: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, "Password must be at least 8 characters"),
    needsPasswordChange: z.boolean().optional(),
  }),
});

const updateUserZodSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    zipCode: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    needsPasswordChange: z.boolean().optional(),
  }),
});

const loginUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  loginUserZodSchema,
};
