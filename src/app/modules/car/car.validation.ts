import { z } from "zod";

const createCarZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    // model: z.string({
    //   required_error: "Model is required",
    // }),
    seats: z
      .number({
        required_error: "Seats is required",
      })
      .min(2, "Minimum 2 seats required"),
    bags: z.number({
      required_error: "Bags is required",
    }),
    image: z.string().optional(),
  }),
});

const updateCarZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    // model: z.string().optional(),
    seats: z.number().min(2, "Minimum 2 seats required").optional(),
    image: z.string().optional(),
  }),
});

export const CarValidation = {
  createCarZodSchema,
  updateCarZodSchema,
};
