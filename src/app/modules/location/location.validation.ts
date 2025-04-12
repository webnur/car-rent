import { z } from "zod";

const createLocationZodSchema = z.object({
  body: z.object({
    location: z.string({
      required_error: "Location name is required",
    }),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
  }),
});

const updateLocationZodSchema = z.object({
  body: z.object({
    location: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
  }),
});

export const LocationValidation = {
  createLocationZodSchema,
  updateLocationZodSchema,
};
