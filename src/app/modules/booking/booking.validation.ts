import { z } from "zod";
import { paymentStatus, paymentType } from "./booking.constants";

const createBookingZodSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: "User ID is required",
    }),
    car: z.string({
      required_error: "Car ID is required",
    }),
    pickupLocation: z.string({
      required_error: "Pickup location ID is required",
    }),
    dropLocation: z.string({
      required_error: "Drop location ID is required",
    }),
    package: z.string({
      required_error: "package is required",
    }),
    pickUpTime: z.string({
      required_error: "Pickup time is required",
    }),
    dropOffTime: z.string({
      required_error: "Dropoff time is required",
    }),
    paymentType: z.enum([...paymentType] as [string, ...string[]], {
      required_error: "Payment type is required",
    }),
    transactionId: z.string().optional(),
  }),
});

const updateBookingZodSchema = z.object({
  body: z.object({
    user: z.string().optional(),
    car: z.string().optional(),
    pickupLocation: z.string().optional(),
    dropLocation: z.string().optional(),
    package: z.string().optional(),
    pickUpTime: z.string().optional(),
    dropOffTime: z.string().optional(),
    totalAmount: z.number().optional(),
    paymentStatus: z
      .enum([...paymentStatus] as [string, ...string[]])
      .optional(),
    paymentType: z.enum([...paymentType] as [string, ...string[]]).optional(),
    amountPaid: z.number().optional(),
    transactionId: z.string().optional(),
  }),
});

export const BookingValidation = {
  createBookingZodSchema,
  updateBookingZodSchema,
};
