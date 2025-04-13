import { z } from "zod";

const createBookingZodSchema = z.object({
  body: z.object({
    car: z.string({
      required_error: "Car ID is required",
    }),
    pickupLocation: z.string({
      required_error: "Pickup location ID is required",
    }),
    dropLocation: z.string({
      required_error: "Drop location ID is required",
    }),
    startDate: z
      .string({
        required_error: "Start date is required",
      })
      .transform((str) => new Date(str)),
    endDate: z
      .string()
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),
    paymentType: z.enum(["full", "partial", "free"], {
      required_error: "Payment type is required",
    }),
    transactionId: z.string().optional(),
  }),
});

const updateBookingZodSchema = z.object({
  body: z.object({
    car: z.string().optional(),
    pickupLocation: z.string().optional(),
    dropLocation: z.string().optional(),
    startDate: z
      .string()
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),
    endDate: z
      .string()
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),
    paymentStatus: z
      .enum(["pending", "partial", "paid", "cancelled"])
      .optional(),
    paymentType: z.enum(["full", "partial", "free"]).optional(),
    amountPaid: z.number().optional(),
    transactionId: z.string().optional(),
  }),
});

export const BookingValidation = {
  createBookingZodSchema,
  updateBookingZodSchema,
};
