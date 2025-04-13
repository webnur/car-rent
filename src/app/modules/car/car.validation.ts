import { z } from "zod";

const createCarZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    model: z.string({
      required_error: "Model is required",
    }),
    seats: z
      .number({
        required_error: "Seats is required",
      })
      .min(2, "Minimum 2 seats required"),
    dailyRate: z
      .number({
        required_error: "Daily rate is required",
      })
      .min(0, "Daily rate must be positive"),
    hourlyRate: z
      .number({
        required_error: "Hourly rate is required",
      })
      .min(0, "Hourly rate must be positive"),
    available: z.boolean().optional(),
    image: z.string().optional(),
  }),
});

const updateCarZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    model: z.string().optional(),
    seats: z.number().min(2, "Minimum 2 seats required").optional(),
    dailyRate: z.number().min(0, "Daily rate must be positive").optional(),
    hourlyRate: z.number().min(0, "Hourly rate must be positive").optional(),
    available: z.boolean().optional(),
    image: z.string().optional(),
  }),
});

export const CarValidation = {
  createCarZodSchema,
  updateCarZodSchema,
};
