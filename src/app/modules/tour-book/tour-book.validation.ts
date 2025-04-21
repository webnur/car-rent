import { z } from "zod";
const statusEnum = z.enum([
  "pending",
  "confirmed",
  "running",
  "completed",
  "cancelled",
]);

const createTourBookZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    pickupLocation: z.string({
      required_error: "Pickup location is required",
    }),
    dropoffLocation: z.string({
      required_error: "Dropoff location is required",
    }),
    pickupDate: z.string({
      required_error: "Pickup date is required",
    }),
    dropoffDate: z.string({
      required_error: "Dropoff date is required",
    }),
    pickupTime: z.string({
      required_error: "Pickup time is required",
    }),
    dropoffTime: z.string({
      required_error: "Dropoff time is required",
    }),
    numberOfPeople: z.number({
      required_error: "Number of people is required",
    }),
    address: z.string({
      required_error: "Address is required",
    }),
    phoneNumber: z.string({
      required_error: "Phone number is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),

    status: statusEnum.optional().default("pending"),
  }),
});

const updateTourBookZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    pickupLocation: z.string().optional(),
    dropoffLocation: z.string().optional(),
    pickupDate: z.string().optional(),
    dropoffDate: z.string().optional(),
    pickupTime: z.string().optional(),
    dropoffTime: z.string().optional(),
    numberOfPeople: z.number().optional(),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    status: statusEnum.optional(),
  }),
});

export const TourBookValidation = {
  createTourBookZodSchema,
  updateTourBookZodSchema,
};
